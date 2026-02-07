<template>
  <div class="warly-landing">
    <!-- Navbar -->
    <fish-layout class="navbar">
      <div slot="header" class="nav-header">
        <div class="nav-inner">
          <span class="logo">Warly</span>
          <fish-menu mode="horizontal" class="nav-menu" @change="onMenuChange">
            <fish-option index="1" content="Home"></fish-option>
            <fish-option index="2" content="Features"></fish-option>
            <fish-option index="3" content="Tools"></fish-option>
            <fish-option index="4" content="Get Started"></fish-option>
          </fish-menu>
        </div>
      </div>
      <div slot="content" style="display:none;"></div>
    </fish-layout>

    <!-- Hero -->
    <section id="hero" class="hero">
      <div class="hero-content">
          <fish-tag class="hero-tag" type="primary">The Agentic Kit</fish-tag>
          <h1 class="hero-title">Warly</h1>
          <p class="hero-subtitle">
            Stellar DeFi in plain language. Check balances, swap XLM ↔ USDC, create trustlines, and get quotes—all through an AI agent.
          </p>
          <div class="hero-actions">
            <fish-button type="primary" size="large" @click="scrollTo('tools')">
              <i class="fa fa-bolt"></i> See tools
            </fish-button>
            <fish-button size="large" @click="scrollTo('features')">
              <i class="fa fa-book"></i> How it works
            </fish-button>
          </div>
        </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="section-inner">
        <h2 class="section-title">How it works</h2>
        <p class="section-desc">One CLI. One agent. Four tools powered by Stellar and SoroSwap.</p>
        <fish-row :gutter="24" class="feature-cards">
          <fish-col :span="12">
            <fish-card class="feature-card">
              <div class="card-icon"><i class="fa fa-wallet"></i></div>
              <h3>Check balance</h3>
              <p>Get token balances for any Stellar address on mainnet or testnet.</p>
            </fish-card>
          </fish-col>
          <fish-col :span="12">
            <fish-card class="feature-card">
              <div class="card-icon"><i class="fa fa-exchange"></i></div>
              <h3>Swap assets</h3>
              <p>Swap XLM ↔ USDC via SoroSwap. Quote first, then execute with your key.</p>
            </fish-card>
          </fish-col>
          <fish-col :span="12">
            <fish-card class="feature-card">
              <div class="card-icon"><i class="fa fa-link"></i></div>
              <h3>Create trustline</h3>
              <p>Create a USDC trustline so your account can receive and hold USDC.</p>
            </fish-card>
          </fish-col>
          <fish-col :span="12">
            <fish-card class="feature-card">
              <div class="card-icon"><i class="fa fa-calculator"></i></div>
              <h3>Get swap quote</h3>
              <p>Get a quote only—no execution, no private key. Perfect for checking rates.</p>
            </fish-card>
          </fish-col>
        </fish-row>
      </div>
    </section>

    <!-- Tools / Flow -->
    <section id="tools" class="tools">
      <div class="section-inner">
        <h2 class="section-title">Agent flow</h2>
        <p class="section-desc">You chat. The LLM picks the right tool and runs it.</p>
        <fish-steps class="flow-steps">
          <fish-step title="You ask" description="e.g. Swap 0.2 XLM to USDC" />
          <fish-step title="Agent chooses tool" description="swap_asset with params" active />
          <fish-step title="Tool runs" description="Quote → build → sign → submit" />
          <fish-step title="You get result" description="txHash + status or quote" />
        </fish-steps>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="cta">
      <div class="section-inner cta-inner">
        <h2 class="section-title">Ready to try Warly?</h2>
        <p class="section-desc">Clone the repo, set your keys, and run the agent.</p>
        <fish-button type="primary" size="large" @click="openRepo">
          <i class="fa fa-github"></i> View on GitHub
        </fish-button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <span>Warly: the agentic kit</span>
        <span>Stellar DeFi + LLM agent</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'WarlyLanding',
  methods: {
    scrollTo (id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    onMenuChange (index) {
      const ids = { '1': 'hero', '2': 'features', '3': 'tools', '4': 'cta' }
      if (ids[index]) this.scrollTo(ids[index])
    },
    openRepo () {
      window.open('https://github.com/stellar/stellar-agent-kit', '_blank')
    },
  },
}
</script>

<style lang="less" scoped>
.warly-landing {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #e4e4e7;
  min-height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.nav-header {
  background: rgba(10, 10, 15, 0.9);
  border-bottom: 1px solid #27272a;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #a78bfa;
}
.nav-menu {
  background: transparent !important;
  border: none !important;
}

.hero {
  padding: 120px 24px 80px;
  text-align: center;
}
.hero-layout {
  background: transparent;
}
.hero-content {
  max-width: 640px;
  margin: 0 auto;
}
.hero-tag {
  display: inline-block;
  margin-bottom: 16px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
}
.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: #fff;
  letter-spacing: -0.02em;
}
.hero-subtitle {
  font-size: 1.25rem;
  color: #a1a1aa;
  line-height: 1.6;
  margin: 0 0 32px;
}
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.section-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 24px;
}
.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: #fff;
  text-align: center;
}
.section-desc {
  font-size: 1.125rem;
  color: #a1a1aa;
  text-align: center;
  margin: 0 0 40px;
}

.features {
  background: #09090b;
  border-top: 1px solid #27272a;
}
.feature-cards {
  margin-top: 24px;
}
.feature-card {
  background: #18181b !important;
  border: 1px solid #27272a !important;
  margin-bottom: 24px;
  padding: 24px !important;
  color: #e4e4e7;
}
.feature-card h3 {
  margin: 0 0 8px;
  font-size: 1.25rem;
  color: #fff;
}
.feature-card p {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.9375rem;
  line-height: 1.5;
}
.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(167, 139, 250, 0.2);
  color: #a78bfa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.tools {
  padding-bottom: 48px;
}
.flow-steps {
  max-width: 640px;
  margin: 0 auto;
}
.flow-steps /deep/ .fish-steps-item {
  color: #a1a1aa;
}
.flow-steps /deep/ .fish-steps-item.fish-steps-item-finish,
.flow-steps /deep/ .fish-steps-item.fish-steps-item-process {
  color: #a78bfa;
}

.cta {
  background: #18181b;
  border-top: 1px solid #27272a;
}
.cta-inner {
  padding: 64px 24px;
}

.footer {
  background: #09090b;
  border-top: 1px solid #27272a;
  color: #71717a;
  text-align: center;
  padding: 24px;
}
.footer-inner {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
</style>
