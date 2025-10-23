# 🌐 DNS Migration Guide - meauxbility.org → Render

## 🎯 **Current Status:**
- **Domain:** meauxbility.org (currently on Shopify)
- **New Service:** https://supabasesupercharge.onrender.com
- **Render IP:** 44.229.227.142
- **Goal:** Point meauxbility.org to your new Next.js app

## 📋 **Step-by-Step DNS Changes:**

### **Step 1: Access Google Domains**
1. **Go to:** https://domains.google.com
2. **Sign in** with your Google account
3. **Find meauxbility.org** in your domain list
4. **Click on meauxbility.org** to open it

### **Step 2: Navigate to DNS Settings**
1. **Look for "DNS"** in the left sidebar
2. **Click on "DNS"**
3. **You should see a table** with all your DNS records

### **Step 3: Update the A Record**
**Find this row:**
```
Type: A
Name: @
Data: 23.227.38.71  ← CHANGE THIS
```

**Change it to:**
```
Type: A
Name: @
Data: 44.229.227.142  ← NEW RENDER IP
```

**How to change it:**
1. **Click the pencil/edit icon** next to the A record
2. **Change the IP address** from `23.227.38.71` to `44.229.227.142`
3. **Click "Save"**

### **Step 4: Update the CNAME Record**
**Find this row:**
```
Type: CNAME
Name: www
Data: shops.myshopify.com  ← CHANGE THIS
```

**Change it to:**
```
Type: CNAME
Name: www
Data: supabasesupercharge.onrender.com  ← NEW RENDER URL
```

**How to change it:**
1. **Click the pencil/edit icon** next to the CNAME record
2. **Change the data** from `shops.myshopify.com` to `supabasesupercharge.onrender.com`
3. **Click "Save"**

### **Step 5: Verify Changes**
**Your DNS table should now show:**
```
Type: A
Name: @
Data: 44.229.227.142

Type: CNAME
Name: www
Data: supabasesupercharge.onrender.com
```

## ⚠️ **Important Notes:**

### **KEEP THESE UNCHANGED:**
- ✅ **AAAA record** - Keep as is (IPv6)
- ✅ **MX records** - Keep all Gmail records
- ✅ **TXT records** - Keep Google verification and Shopify records

### **What This Will Do:**
- **meauxbility.org** → Points to your new Render app
- **www.meauxbility.org** → Points to your new Render app
- **Shopify store** → Becomes inaccessible (temporarily)
- **Gmail/Google services** → Still work fine

## ⏰ **Timeline:**
- **DNS propagation:** 5-15 minutes (usually)
- **Full propagation:** Up to 48 hours (rare)
- **Test immediately:** You can test right away

## 🧪 **Test URLs After DNS Update:**
- **Homepage:** `meauxbility.org/`
- **Test page:** `meauxbility.org/test` ← **This will confirm it's working**
- **Admin portal:** `meauxbility.org/admin`

## 🔄 **Rollback Plan:**
If something goes wrong, you can quickly revert:
1. **Change A record back to:** `23.227.38.71`
2. **Change CNAME back to:** `shops.myshopify.com`
3. **Wait 5-15 minutes** for reversion

## 🚀 **After DNS Changes:**
1. **Test the new site** at meauxbility.org
2. **Verify all pages work** (/, /test, /admin, etc.)
3. **Start migrating content** from Shopify
4. **Begin building new features** with AI assistance

## 📞 **Need Help?**
- **DNS not updating?** Try clearing your browser cache
- **Site not loading?** Check if you're using a VPN
- **Still seeing Shopify?** Wait a few more minutes for propagation

**Ready to make the DNS changes? Let me know when you've updated the records!** 🎯
