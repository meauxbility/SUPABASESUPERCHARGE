#!/usr/bin/env node

/**
 * Notion Integration Script for Meauxbility
 * Syncs repository data with Notion workspace
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Configuration
const CONFIG = {
  databaseId: process.env.NOTION_DATABASE_ID,
  pageId: process.env.NOTION_PAGE_ID,
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Sync repository information to Notion
 */
async function syncRepositoryInfo() {
  try {
    console.log('🔄 Syncing repository information to Notion...');

    // Get repository information
    const repoInfo = {
      name: 'Meauxbility',
      lastSync: new Date().toISOString(),
      status: 'active',
      teamMembers: [
        { name: 'Brandon Primeaux', role: 'Owner', email: 'brandon@meauxbility.org' },
        { name: 'Teammate', role: 'Maintainer', email: 'teammate@meauxbility.org' }
      ],
      aiAgents: [
        { name: 'Primary AI Agent', role: 'Code Review', permissions: ['read', 'write', 'review'] },
        { name: 'Security AI Agent', role: 'Security Scan', permissions: ['read', 'scan'] }
      ]
    };

    // Update Notion database
    if (CONFIG.databaseId) {
      await updateNotionDatabase(repoInfo);
    }

    // Update Notion page
    if (CONFIG.pageId) {
      await updateNotionPage(repoInfo);
    }

    console.log('✅ Repository information synced successfully!');
  } catch (error) {
    console.error('❌ Error syncing to Notion:', error.message);
    process.exit(1);
  }
}

/**
 * Update Notion database with repository information
 */
async function updateNotionDatabase(repoInfo) {
  try {
    // Query existing entries
    const response = await notion.databases.query({
      database_id: CONFIG.databaseId,
      filter: {
        property: 'Name',
        title: {
          equals: repoInfo.name
        }
      }
    });

    const properties = {
      'Name': {
        title: [
          {
            text: {
              content: repoInfo.name
            }
          }
        ]
      },
      'Last Sync': {
        date: {
          start: repoInfo.lastSync
        }
      },
      'Status': {
        select: {
          name: repoInfo.status
        }
      },
      'Team Members': {
        rich_text: [
          {
            text: {
              content: repoInfo.teamMembers.map(member => 
                `${member.name} (${member.role})`
              ).join(', ')
            }
          }
        ]
      }
    };

    if (response.results.length > 0) {
      // Update existing entry
      await notion.pages.update({
        page_id: response.results[0].id,
        properties: properties
      });
      console.log('📝 Updated existing Notion database entry');
    } else {
      // Create new entry
      await notion.pages.create({
        parent: {
          database_id: CONFIG.databaseId
        },
        properties: properties
      });
      console.log('➕ Created new Notion database entry');
    }
  } catch (error) {
    console.error('❌ Error updating Notion database:', error.message);
  }
}

/**
 * Update Notion page with detailed information
 */
async function updateNotionPage(repoInfo) {
  try {
    const content = [
      {
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `🔄 Meauxbility Repository Sync - ${new Date().toLocaleDateString()}`
              }
            }
          ]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Last sync: ${repoInfo.lastSync}`
              }
            }
          ]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '👥 Team Members'
              }
            }
          ]
        }
      }
    ];

    // Add team members
    repoInfo.teamMembers.forEach(member => {
      content.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${member.name} - ${member.role} (${member.email})`
              }
            }
          ]
        }
      });
    });

    content.push({
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: '🤖 AI Agents'
            }
          }
        ]
      }
    });

    // Add AI agents
    repoInfo.aiAgents.forEach(agent => {
      content.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${agent.name} - ${agent.role} (${agent.permissions.join(', ')})`
              }
            }
          ]
        }
      });
    });

    // Update the page
    await notion.pages.update({
      page_id: CONFIG.pageId,
      properties: {
        title: {
          title: [
            {
              text: {
                content: `Meauxbility Sync - ${new Date().toLocaleDateString()}`
              }
            }
          ]
        }
      }
    });

    console.log('📄 Updated Notion page with sync information');
  } catch (error) {
    console.error('❌ Error updating Notion page:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Notion sync for Meauxbility...');
  
  // Check environment variables
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ NOTION_API_KEY environment variable is required');
    process.exit(1);
  }

  await syncRepositoryInfo();
  console.log('🎉 Notion sync completed successfully!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { syncRepositoryInfo };
