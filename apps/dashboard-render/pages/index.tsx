import { useEffect } from 'react';
import Layout from '../components/Layout';

export default function HomePage() {
  useEffect(() => {
    // Hero Image Scale on Scroll
    const heroMedia = document.getElementById('meauxxxHeroMedia');
    if (heroMedia) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('meauxxxInView');
          }
        });
      }, {threshold: 0.1});
      observer.observe(heroMedia);
    }

    // Animation Observer
    const observerOptions = {threshold: 0.1, rootMargin: '0px 0px -50px 0px'};
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('meauxxxInView');
            if (entry.target.id === 'meauxxxCommunityCard') {
              window.dispatchEvent(new CustomEvent('communityCardVisible'));
            }
          }, delay);
          animateObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      animateObserver.observe(el);
    });

    // Campaign Image Glisten
    const campaignImage = document.getElementById('meauxxxCampaignImage');
    if (campaignImage) {
      const campaignObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => campaignImage.classList.add('meauxxxGlisten'), 500);
          campaignObserver.unobserve(campaignImage);
        }
      }, {threshold: 0.3});
      campaignObserver.observe(campaignImage);
    }

    // Progress Bar
    const savedAmount = parseInt(localStorage.getItem('donmichael_meauxxx') || '0');
    const percent = Math.min((savedAmount / 10000) * 100, 100);
    const progressAmount = document.getElementById('meauxxxProgressAmount');
    const progressBar = document.getElementById('meauxxxProgressBar');
    if (progressAmount) progressAmount.textContent = `$${savedAmount.toLocaleString()} raised`;
    if (progressBar) progressBar.style.width = percent + '%';

    // Global functions
    (window as any).morphIcon = function(element: HTMLElement) {
      element.classList.toggle('morphed');
    };

    (window as any).openMeauxxxModal = function(preset: string) {
      const modal = document.getElementById('meauxxxModalBackdrop');
      if (modal) {
        modal.classList.add('meauxxxActive');
        document.body.style.overflow = 'hidden';
      }
    };

    (window as any).closeMeauxxxModal = function() {
      const modal = document.getElementById('meauxxxModalBackdrop');
      if (modal) {
        modal.classList.remove('meauxxxActive');
        document.body.style.overflow = '';
      }
    };

    (window as any).selectMeauxxxAmount = function(amt: number) {
      (window as any).meauxxxAmount = amt;
      document.querySelectorAll('.meauxxxAmountBtn').forEach((btn: Element) => btn.classList.remove('meauxxxSelected'));
      (event?.target as HTMLElement)?.classList.add('meauxxxSelected');
    };

    (window as any).selectMeauxxxCustom = function(val: string) {
      if (val && parseFloat(val) > 0) {
        (window as any).meauxxxAmount = parseFloat(val);
        document.querySelectorAll('.meauxxxAmountBtn').forEach((btn: Element) => btn.classList.remove('meauxxxSelected'));
      }
    };

    (window as any).setMeauxxxFrequency = function(type: string) {
      (window as any).meauxxxFrequency = type;
      document.querySelectorAll('.meauxxxFrequencyBtn').forEach((btn: Element) => btn.classList.remove('meauxxxActive'));
      (event?.target as HTMLElement)?.classList.add('meauxxxActive');
    };

    (window as any).processMeauxxxDonation = async function() {
      console.log('Processing donation:', (window as any).meauxxxAmount, (window as any).meauxxxFrequency);
    };

    (window as any).openApplicationModal = function() {
      console.log('Application modal in Section 2');
    };

  }, []);

  return (
    <Layout title="Meauxbility - Built by a survivor for survivors" description="We connect people with spinal cord injuries to treatments, technology, and community that change outcomes.">
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0C2D31;line-height:1.6;-webkit-font-smoothing:antialiased}

        :root{
        --meauxxxPrimary:#FF6B00;
        --meauxxxPrimaryDark:#E85D00;
        --meauxxxPrimaryLight:#FF8A33;
        --meauxxxSecondary:#339999;
        --meauxxxSecondaryDark:#2C8B8B;
        --meauxxxAccent:#8b5cf6;
        --meauxxxTextPrimary:#0C2D31;
        --meauxxxTextSecondary:#173E45;
        --meauxxxSurface:#FFFFFF;
        --meauxxxSurfaceAlt:#F7FAFB;
        --meauxxxBorder:rgba(12,45,49,0.08);
        --meauxxxContainer:min(1440px,100%);
        --meauxxxEase:cubic-bezier(0.4,0,0.2,1);
        --meauxxxEaseOut:cubic-bezier(0,0,0.2,1)
        }

        .meauxxxContainer{max-width:var(--meauxxxContainer);margin:0 auto;padding:0 1.5rem}
        @media(min-width:768px){.meauxxxContainer{padding:0 2rem}}

        .meauxxxHeadingXL{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.1;letter-spacing:-0.02em;margin:0}
        .meauxxxHeadingLG{font-size:clamp(1.75rem,4vw,3rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;margin:0}
        .meauxxxHeadingMD{font-size:clamp(1.25rem,2.5vw,1.75rem);font-weight:700;line-height:1.2;margin:0;text-align:center}
        .meauxxxTextLead{font-size:clamp(1.125rem,2vw,1.375rem);line-height:1.6;color:var(--meauxxxTextSecondary)}
        .meauxxxTextHighlight{color:var(--meauxxxPrimary);font-weight:700}

        .meauxxxButton{display:inline-block;padding:12px 18px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;transition:transform .2s ease,background-color .25s ease,color .25s ease,box-shadow .25s ease;cursor:pointer;border:none;position:relative;overflow:hidden;white-space:nowrap}
        .meauxxxButton:focus-visible{outline:2px solid var(--meauxxxPrimary);outline-offset:3px}
        .meauxxxButtonPrimary{background:linear-gradient(135deg,#FF6B35 0%,#E85D00 100%);color:#ffffff;box-shadow:0 8px 18px rgba(0,0,0,.25)}
        .meauxxxButtonPrimary:hover{transform:translateY(-2px);background:linear-gradient(135deg,#FF7A1A 0%,#F06D10 100%);box-shadow:0 10px 22px rgba(0,0,0,.3)}
        .meauxxxButtonSecondary{color:#FF6B35;background:transparent;border:2px solid #FF6B35}
        .meauxxxButtonSecondary:hover{color:#fff;background:#FF6B35;transform:translateY(-1px);box-shadow:0 4px 12px rgba(255,107,53,0.3)}
        .meauxxxButtonGroup{display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:3rem}

        /* FIXED: Right-to-Left Announcement with Better Typography */
        .meauxxxAnnouncement{background:var(--meauxxxSurface);border-bottom:1px solid var(--meauxxxBorder);padding:0.75rem 0;overflow:hidden;position:relative}
        .meauxxxAnnouncementWrapper{display:flex;position:relative;width:200%}
        .meauxxxAnnouncementTrack{display:flex;animation:meauxxxRTL 25s linear infinite;width:100%;gap:4rem}
        @keyframes meauxxxRTL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .meauxxxAnnouncementText{display:inline-block;font-weight:900;font-size:1.125rem;letter-spacing:-0.01em;text-transform:uppercase;white-space:nowrap}
        .meauxxxAnnouncementDot{color:var(--meauxxxPrimary);margin:0 1rem;font-size:0.8rem}

        /* Hero with Fixed Image Scale Animation */
        .meauxxxHero{padding:clamp(4rem,8vw,6rem) 0 2rem;min-height:85vh;display:flex;align-items:center;background:linear-gradient(180deg,var(--meauxxxSurface) 0%,var(--meauxxxSurface) 60%,var(--meauxxxSurfaceAlt) 100%)}
        .meauxxxHeroContent{text-align:center}
        .meauxxxHeroMedia{position:relative;width:100%;max-width:1000px;margin:0 auto 2rem;border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.12);background:var(--meauxxxSurfaceAlt)}
        .meauxxxHeroMedia img{width:100%;height:auto;display:block;transform:scale(1.1);transition:transform 1.2s var(--meauxxxEaseOut);will-change:transform}
        .meauxxxHeroMedia.meauxxxInView img{transform:scale(1)}
        .meauxxxHeroTitle{margin-bottom:1.5rem}
        .meauxxxHeroDescription{max-width:800px;margin:0 auto 2rem}

        /* ENHANCED: Values with Icon Morph Only */
        .meauxxxValues{padding:3rem 0 4rem;background:var(--meauxxxSurfaceAlt)}
        .meauxxxValuesHeader{text-align:center;margin-bottom:3rem}
        .meauxxxValuesGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:3rem;margin-top:3rem}
        .meauxxxValueCard{text-align:center;opacity:0;transform:translateY(20px);transition:all 0.6s var(--meauxxxEase)}
        .meauxxxValueCard.meauxxxInView{opacity:1;transform:translateY(0)}
        .meauxxxIconMorph{position:relative;width:180px;height:180px;margin:0 auto 1rem;cursor:pointer}
        .meauxxxValueIcon{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.08));transition:opacity 0.4s ease,transform 0.4s ease}
        .meauxxxIconText{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:var(--meauxxxSecondary);text-align:center;opacity:0;transform:scale(0.8);transition:opacity 0.4s ease,transform 0.4s ease}
        .meauxxxIconMorph.morphed .meauxxxValueIcon{opacity:0;transform:scale(0.8)}
        .meauxxxIconMorph.morphed .meauxxxIconText{opacity:1;transform:scale(1)}
        .meauxxxValueLabel{display:block;font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--meauxxxPrimary);margin-bottom:0.5rem;text-align:center}
        .meauxxxValueTitle{margin-bottom:1rem;text-align:center}
        .meauxxxValueDescription{color:var(--meauxxxTextSecondary);max-width:320px;margin:0 auto;text-align:center}

        .meauxxxGap{padding:4rem 0;background:var(--meauxxxSurface)}
        .meauxxxGapHeader{text-align:center;margin-bottom:3rem}
        .meauxxxGapGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-top:2rem}
        .meauxxxGapCard{padding:1.5rem;background:var(--meauxxxSurface);border:1px solid var(--meauxxxBorder);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:all 0.3s var(--meauxxxEase);position:relative;overflow:hidden}
        .meauxxxGapCard::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:var(--meauxxxSecondary);transform:scaleY(0);transition:transform 0.3s var(--meauxxxEase)}
        .meauxxxGapCard:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.08);border-color:var(--meauxxxSecondary)}
        .meauxxxGapCard:hover::before{transform:scaleY(1)}
        .meauxxxGapCardTitle{font-size:1.125rem;font-weight:700;color:var(--meauxxxSecondary);margin-bottom:0.5rem}
        .meauxxxGapCardText{color:var(--meauxxxTextSecondary);line-height:1.6}

        .meauxxxCampaign{padding:3rem 0;background:white}
        .meauxxxCampaignLayout{display:grid;grid-template-columns:1fr;gap:2rem;align-items:center;max-width:1100px;margin:0 auto}
        @media(min-width:768px){.meauxxxCampaignLayout{grid-template-columns:0.8fr 1.2fr;gap:3rem}}
        .meauxxxCampaignImage{border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.12);position:relative;max-width:450px}
        .meauxxxCampaignImage::after{content:'';position:absolute;top:-100%;left:-100%;width:200%;height:200%;background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%);transform:rotate(45deg);transition:all 1.5s ease;opacity:0}
        .meauxxxCampaignImage.meauxxxGlisten::after{animation:meauxxxGlistenAnim 1.5s ease}
        @keyframes meauxxxGlistenAnim{0%{transform:rotate(45deg) translateX(-100%);opacity:0}50%{opacity:1}100%{transform:rotate(45deg) translateX(100%);opacity:0}}
        .meauxxxCampaignImage img{width:100%;height:auto;display:block}
        .meauxxxCampaignContent{padding:1rem 0}
        .meauxxxCampaignNumber{font-size:3rem;font-weight:900;color:var(--meauxxxSecondary);margin-bottom:0.5rem}
        .meauxxxCampaignText{color:var(--meauxxxTextSecondary);margin-bottom:1rem;font-size:1.375rem;font-weight:500;line-height:1.6}
        .meauxxxCampaignText strong{color:var(--meauxxxPrimary);font-weight:800}
        .meauxxxProgress{margin:2rem 0}
        .meauxxxProgressBar{height:16px;background:rgba(51,153,153,0.1);border-radius:999px;overflow:hidden;position:relative}
        .meauxxxProgressFill{height:100%;background:linear-gradient(90deg,var(--meauxxxSecondary),var(--meauxxxSecondaryDark));border-radius:999px;transition:width 1.5s cubic-bezier(0.4,0,0.2,1);position:relative}
        .meauxxxProgressFill::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);animation:meauxxxShimmer 2s infinite}
        @keyframes meauxxxShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .meauxxxProgressText{display:flex;justify-content:space-between;margin-top:0.75rem;font-size:1.125rem;font-weight:600;color:var(--meauxxxTextSecondary)}
        .meauxxxProgressAmount{font-weight:800;color:var(--meauxxxTextPrimary)}

        /* RESTORED: Full Donation Modal */
        .meauxxxModalBackdrop{position:fixed;inset:0;background:rgba(5,27,30,0.9);display:none;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.3s ease;padding:1rem}
        .meauxxxModalBackdrop.meauxxxActive{display:flex;opacity:1}
        .meauxxxModal{width:min(680px,95vw);max-height:85vh;background:white;border-radius:16px;box-shadow:0 24px 48px rgba(0,0,0,0.2);overflow:hidden;transform:scale(0.9) translateY(20px);transition:transform 0.3s ease;position:relative}
        .meauxxxModalBackdrop.meauxxxActive .meauxxxModal{transform:scale(1) translateY(0)}
        .meauxxxModalHeader{display:flex;align-items:center;justify-content:space-between;padding:1.5rem;border-bottom:1px solid rgba(0,0,0,0.1);background:linear-gradient(135deg,rgba(255,107,0,0.05) 0%,rgba(51,153,153,0.05) 100%)}
        .meauxxxModalHeader::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--meauxxxPrimary) 0%,var(--meauxxxSecondary) 100%)}
        .meauxxxModalTitle{font-weight:900;color:var(--meauxxxTextPrimary);font-size:1.5rem;margin:0}
        .meauxxxModalSubtitle{color:var(--meauxxxTextSecondary);font-size:0.9rem;margin-top:0.25rem}
        .meauxxxModalClose{appearance:none;border:0;background:transparent;cursor:pointer;padding:8px;border-radius:8px;font-size:1.5rem;color:var(--meauxxxTextPrimary);transition:all 0.2s}
        .meauxxxModalClose:hover{background:rgba(255,107,0,0.1);color:var(--meauxxxPrimary);transform:rotate(90deg)}
        .meauxxxModalBody{padding:1.25rem}
        .meauxxxDonateGrid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
        @media(max-width:640px){.meauxxxDonateGrid{grid-template-columns:1fr;gap:1rem}}
        .meauxxxDonateOptions{background:rgba(51,153,153,0.05);border:1px solid rgba(51,153,153,0.2);border-radius:12px;padding:1rem}
        .meauxxxOptionTitle{font-size:1.125rem;font-weight:800;color:var(--meauxxxTextPrimary);margin-bottom:1rem}
        .meauxxxFrequencyToggle{display:flex;background:rgba(0,0,0,0.05);border-radius:6px;padding:3px;margin-bottom:1rem}
        .meauxxxFrequencyBtn{flex:1;padding:0.5rem;background:transparent;border:none;color:var(--meauxxxTextSecondary);font-weight:600;cursor:pointer;border-radius:4px;transition:all 0.2s;font-size:0.875rem}
        .meauxxxFrequencyBtn.meauxxxActive{background:linear-gradient(135deg,var(--meauxxxPrimary) 0%,var(--meauxxxPrimaryDark) 100%);color:white}
        .meauxxxAmountGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:0.75rem}
        .meauxxxAmountBtn{padding:0.625rem;background:white;border:2px solid rgba(51,153,153,0.2);border-radius:6px;color:var(--meauxxxTextPrimary);font-weight:700;cursor:pointer;transition:all 0.2s;font-size:0.875rem}
        .meauxxxAmountBtn:hover{background:rgba(51,153,153,0.1);border-color:var(--meauxxxSecondary);transform:translateY(-1px)}
        .meauxxxAmountBtn.meauxxxSelected{background:linear-gradient(135deg,rgba(51,153,153,0.2),rgba(51,153,153,0.1));border-color:var(--meauxxxSecondary);color:var(--meauxxxSecondaryDark)}
        .meauxxxCustomAmount{width:100%;padding:0.625rem;background:white;border:2px solid rgba(51,153,153,0.2);border-radius:6px;color:var(--meauxxxTextPrimary);font-size:0.875rem;margin-bottom:0.75rem}
        .meauxxxCustomAmount:focus{outline:none;border-color:var(--meauxxxSecondary)}
        .meauxxxDesignation select{width:100%;padding:0.625rem;background:white;border:2px solid rgba(51,153,153,0.2);border-radius:6px;color:var(--meauxxxTextPrimary);font-size:0.875rem}
        .meauxxxDonorInfo{background:rgba(255,107,0,0.03);border:1px solid rgba(255,107,0,0.2);border-radius:12px;padding:1rem}
        .meauxxxFormGroup{margin-bottom:0.75rem}
        .meauxxxFormGroup label{display:block;color:var(--meauxxxTextPrimary);margin-bottom:0.25rem;font-weight:600;font-size:0.875rem}
        .meauxxxFormInput{width:100%;padding:0.625rem;background:white;border:2px solid rgba(255,107,0,0.2);border-radius:6px;color:var(--meauxxxTextPrimary);font-size:0.875rem}
        .meauxxxFormInput:focus{outline:none;border-color:var(--meauxxxPrimary)}
        .meauxxxNameGrid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
        .meauxxxStripeElement{padding:0.625rem;background:white;border:2px solid rgba(255,107,0,0.2);border-radius:6px}
        .meauxxxDonateSubmit{width:100%;padding:1rem;background:linear-gradient(135deg,var(--meauxxxPrimary) 0%,var(--meauxxxPrimaryDark) 100%);color:white;border:none;border-radius:8px;font-size:1rem;font-weight:800;cursor:pointer;transition:all 0.2s;margin-top:1rem}
        .meauxxxDonateSubmit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,107,0,0.3)}
        .meauxxxDonateSubmit:disabled{opacity:0.6;cursor:not-allowed}
        .meauxxxSecurityNotice{display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:1rem;color:var(--meauxxxTextSecondary);font-size:0.75rem}
        .meauxxxSuccessMessage{display:none;text-align:center;padding:1.5rem;background:rgba(33,196,140,0.1);border:1px solid rgba(33,196,140,0.3);border-radius:12px;margin-bottom:1rem}
        .meauxxxSuccessMessage.meauxxxShow{display:block}

        @media(prefers-reduced-motion:reduce){
        .meauxxxAnnouncementTrack{animation:none}
        .meauxxxHeroMedia img,.meauxxxValueCard,.meauxxxGapCard{transition-duration:0.01ms}
        }
        @media(max-width:768px){
        .meauxxxHero{min-height:auto;padding:3rem 0 1rem}
        .meauxxxButtonGroup{justify-content:center}
        .meauxxxValuesGrid,.meauxxxGapGrid{gap:2rem}
        }
      `}</style>

      {/* FIXED: Right-to-Left Announcement with Bold Typography */}
      <section className="meauxxxAnnouncement">
        <div className="meauxxxContainer">
          <div className="meauxxxAnnouncementWrapper">
            <div className="meauxxxAnnouncementTrack">
              <span className="meauxxxAnnouncementText">MORE OPTIONS <span className="meauxxxAnnouncementDot">•</span> MORE ACCESS <span className="meauxxxAnnouncementDot">•</span> MORE LIFE</span>
              <span className="meauxxxAnnouncementText">MORE OPTIONS <span className="meauxxxAnnouncementDot">•</span> MORE ACCESS <span className="meauxxxAnnouncementDot">•</span> MORE LIFE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="meauxxxHero">
        <div className="meauxxxContainer">
          <div className="meauxxxHeroContent">
            <div className="meauxxxHeroMedia" id="meauxxxHeroMedia">
              <img src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/sam-smile-pikes-peak.jpg?v=1754025762" alt="Sam Primeaux at Pikes Peak" loading="eager" />
            </div>
            <h1 className="meauxxxHeadingXL meauxxxHeroTitle">Built by a survivor for survivors.</h1>
            <p className="meauxxxTextLead meauxxxHeroDescription">
              We connect people with <span className="meauxxxTextHighlight">spinal cord injuries</span> to the
              <span className="meauxxxTextHighlight"> treatments</span>, 
              <span className="meauxxxTextHighlight"> technology</span>, and
              <span className="meauxxxTextHighlight"> community</span> that change outcomes.
            </p>
            <div className="meauxxxButtonGroup">
              <button className="meauxxxButton meauxxxButtonPrimary" onClick={() => (window as any).openApplicationModal()}>Get Support</button>
              <a href="https://meauxbility.org/pages/donmichael-our-first-campaign" className="meauxxxButton meauxxxButtonSecondary">Our First Campaign</a>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED: Icon Morph Only */}
      <section className="meauxxxValues">
        <div className="meauxxxContainer">
          <div className="meauxxxValuesHeader">
            <h2 className="meauxxxHeadingLG">Why Meauxbility</h2>
          </div>
          <div className="meauxxxValuesGrid">
            <article className="meauxxxValueCard" data-animate="fade-up">
              <div className="meauxxxIconMorph" onClick={(e) => (window as any).morphIcon(e.currentTarget)}>
                <img className="meauxxxValueIcon" src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/5.png?v=1753332352" alt="Mission" />
                <div className="meauxxxIconText">AMBITION</div>
              </div>
              <span className="meauxxxValueLabel">OUR MISSION</span>
              <h3 className="meauxxxHeadingMD meauxxxValueTitle">Experience-Driven Recovery</h3>
              <p className="meauxxxValueDescription">Founded by Sam Primeaux after his 2017 paralysis. We turn lived experience into a roadmap others can follow to recovery.</p>
            </article>
            <article className="meauxxxValueCard" data-animate="fade-up" data-delay="100">
              <div className="meauxxxIconMorph" onClick={(e) => (window as any).morphIcon(e.currentTarget)}>
                <img className="meauxxxValueIcon" src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/6.png?v=1753332353" alt="Empowerment" />
                <div className="meauxxxIconText">EMPOWERMENT</div>
              </div>
              <span className="meauxxxValueLabel">EMPOWERMENT</span>
              <h3 className="meauxxxHeadingMD meauxxxValueTitle">Transform Your Journey</h3>
              <p className="meauxxxValueDescription">We combine funding, mentorship, and a practical recovery playbook so people with mobility challenges can accelerate their progress.</p>
            </article>
            <article className="meauxxxValueCard" data-animate="fade-up" data-delay="200" id="meauxxxCommunityCard">
              <div className="meauxxxIconMorph" onClick={(e) => (window as any).morphIcon(e.currentTarget)}>
                <img className="meauxxxValueIcon" src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/3_c666d932-e895-4620-928e-20762c2be381.png?v=1753332353" alt="Community" />
                <div className="meauxxxIconText">ADAPTABILITY</div>
              </div>
              <span className="meauxxxValueLabel">COMMUNITY</span>
              <h3 className="meauxxxHeadingMD meauxxxValueTitle">Stronger Together</h3>
              <p className="meauxxxValueDescription">What began as one story is now a growing network creating more access—and more life—together. Join the movement.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="meauxxxGap">
        <div className="meauxxxContainer">
          <div className="meauxxxGapHeader">
            <h2 className="meauxxxHeadingLG">The Gap We're Closing</h2>
            <p className="meauxxxTextLead">Three barriers stand between injury and independence. We're removing them.</p>
          </div>
          <div className="meauxxxGapGrid">
            <article className="meauxxxGapCard" data-animate="fade-up">
              <h3 className="meauxxxGapCardTitle">COST</h3>
              <p className="meauxxxGapCardText">First-year SCI costs reach $1.4M. Lifetime up to $6.3M. We connect survivors to funding and resources.</p>
            </article>
            <article className="meauxxxGapCard" data-animate="fade-up" data-delay="100">
              <h3 className="meauxxxGapCardTitle">KNOWLEDGE</h3>
              <p className="meauxxxGapCardText">18,400 new SCIs yearly. Families waste precious time searching. We provide instant vetted guidance.</p>
            </article>
            <article className="meauxxxGapCard" data-animate="fade-up" data-delay="200">
              <h3 className="meauxxxGapCardTitle">ACCESS</h3>
              <p className="meauxxxGapCardText">Equipment exists but remains unreachable. We bridge the gap between innovation and those who need it.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="meauxxxCampaign">
        <div className="meauxxxContainer">
          <div className="meauxxxCampaignLayout">
            <div className="meauxxxCampaignImage" id="meauxxxCampaignImage">
              <img src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/img-5722.jpg?v=1754010593" alt="DonMichael" loading="lazy" />
            </div>
            <div className="meauxxxCampaignContent">
              <div className="meauxxxCampaignNumber">01</div>
              <h2 className="meauxxxHeadingLG">Help Fund DonMichael's New Beginning</h2>
              <p className="meauxxxCampaignText">
                Mobility challenges touch every part of life—freedom, opportunity, and dignity. 
                Our first initiative is raising <strong>$10,000</strong> to provide DonMichael, 
                living with Friedreich's ataxia, a custom wheelchair that truly fits his needs.
              </p>
              <p className="meauxxxCampaignText">
                This isn't just equipment—it's independence, access, and the confidence to pursue life on his terms.
              </p>
              <div className="meauxxxProgress">
                <div className="meauxxxProgressBar">
                  <div className="meauxxxProgressFill" id="meauxxxProgressBar" style={{width: '0%'}}></div>
                </div>
                <div className="meauxxxProgressText">
                  <span className="meauxxxProgressAmount" id="meauxxxProgressAmount">$0 raised</span>
                  <span>$10,000 goal</span>
                </div>
              </div>
              <div className="meauxxxButtonGroup">
                <button className="meauxxxButton meauxxxButtonPrimary" onClick={() => (window as any).openMeauxxxModal('donmichael')}>Be DonMichael's First Hero →</button>
                <a href="https://meauxbility.org/pages/donmichael-our-first-campaign" className="meauxxxButton meauxxxButtonSecondary">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESTORED: Full Donation Modal */}
      <div className="meauxxxModalBackdrop" id="meauxxxModalBackdrop">
        <div className="meauxxxModal">
          <div className="meauxxxModalHeader">
            <div>
              <h3 className="meauxxxModalTitle">Support DonMichael's Campaign</h3>
              <p className="meauxxxModalSubtitle">Every dollar transforms lives</p>
            </div>
            <button className="meauxxxModalClose" onClick={() => (window as any).closeMeauxxxModal()}>&times;</button>
          </div>
          <div className="meauxxxModalBody">
            <div className="meauxxxSuccessMessage" id="meauxxxSuccessMsg">
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
              <div style={{fontWeight: 800, color: 'var(--meauxxxTextPrimary)', marginBottom: '0.25rem'}}>Thank You!</div>
              <div style={{color: 'var(--meauxxxTextSecondary)', fontSize: '0.875rem'}}>Your donation has been processed successfully.</div>
            </div>
            <div className="meauxxxDonateGrid">
              <div className="meauxxxDonateOptions">
                <h3 className="meauxxxOptionTitle">Choose Your Gift</h3>
                <div className="meauxxxFrequencyToggle">
                  <button className="meauxxxFrequencyBtn meauxxxActive" onClick={() => (window as any).setMeauxxxFrequency('one_time')}>One Time</button>
                  <button className="meauxxxFrequencyBtn" onClick={() => (window as any).setMeauxxxFrequency('monthly')}>Monthly</button>
                </div>
                <div className="meauxxxAmountGrid">
                  <button className="meauxxxAmountBtn" onClick={() => (window as any).selectMeauxxxAmount(25)}>$25</button>
                  <button className="meauxxxAmountBtn" onClick={() => (window as any).selectMeauxxxAmount(50)}>$50</button>
                  <button className="meauxxxAmountBtn" onClick={() => (window as any).selectMeauxxxAmount(100)}>$100</button>
                  <button className="meauxxxAmountBtn meauxxxSelected" onClick={() => (window as any).selectMeauxxxAmount(250)}>$250</button>
                  <button className="meauxxxAmountBtn" onClick={() => (window as any).selectMeauxxxAmount(500)}>$500</button>
                  <button className="meauxxxAmountBtn" onClick={() => (window as any).selectMeauxxxAmount(1000)}>$1k</button>
                </div>
                <input type="number" className="meauxxxCustomAmount" placeholder="Custom amount" min="1" onInput={(e) => (window as any).selectMeauxxxCustom((e.target as HTMLInputElement).value)} />
                <div className="meauxxxDesignation">
                  <select id="meauxxxDesignation">
                    <option value="general">Where Most Needed</option>
                    <option value="donmichael" selected>DonMichael's Wheelchair</option>
                    <option value="samscar">Sam's Car Fund</option>
                  </select>
                </div>
              </div>
              <div className="meauxxxDonorInfo">
                <h3 className="meauxxxOptionTitle">Your Information</h3>
                <div className="meauxxxNameGrid">
                  <div className="meauxxxFormGroup">
                    <label>First Name</label>
                    <input type="text" className="meauxxxFormInput" id="meauxxxFirstName" required />
                  </div>
                  <div className="meauxxxFormGroup">
                    <label>Last Name</label>
                    <input type="text" className="meauxxxFormInput" id="meauxxxLastName" required />
                  </div>
                </div>
                <div className="meauxxxFormGroup">
                  <label>Email</label>
                  <input type="email" className="meauxxxFormInput" id="meauxxxEmail" required />
                </div>
                <div className="meauxxxFormGroup">
                  <label>Card Information</label>
                  <div id="meauxxx-card-element" className="meauxxxStripeElement"></div>
                </div>
                <button className="meauxxxDonateSubmit" onClick={() => (window as any).processMeauxxxDonation()}>
                  <span>Complete Donation</span>
                </button>
                <div className="meauxxxSecurityNotice">
                  🔒 Secure & tax-deductible
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}