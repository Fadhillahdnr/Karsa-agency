<script setup lang="ts">
const { contactChannels } = useKarsaConfig()

useSeoMeta({
  title: 'Privacy',
  description: 'How Karsa Studio collects, uses, and stores information submitted through this website.',
})
</script>

<template>
  <div>
    <BaseSection
      tight
      narrow
      class="pt-32"
    >
      <BaseHeading
        eyebrow="Privacy"
        size="display-2"
        as="h1"
      >
        Privacy Policy
      </BaseHeading>

      <div class="prose prose-invert mt-12 max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]">
        <h2>What we collect</h2>
        <p>
          When you submit the Start a Project form, we collect the information you provide directly: name,
          email address, company (optional), phone (optional), the service you're inquiring about, budget
          range (optional), timeline (optional), your project description, and how you heard about us (optional).
        </p>

        <h2>Why we collect it</h2>
        <p>
          This information is used solely to evaluate your project inquiry, respond to you, and — if we move
          forward — to scope and deliver the engagement. We don't use it for unrelated marketing without your
          separate consent.
        </p>

        <h2>How it's stored</h2>
        <p>
          Submitted inquiries are stored in a Supabase-hosted database accessible only to Karsa Studio. Your
          submission also triggers two emails: one internal notification to Karsa, and one confirmation email
          sent to the address you provided.
        </p>

        <h2>Third-party processors</h2>
        <p>
          We rely on a small number of third-party services to operate this website and process inquiries:
        </p>
        <ul>
          <li>A database provider, to store submitted inquiries.</li>
          <li>A transactional email provider, to deliver notification and confirmation emails.</li>
          <li>A bot-protection service, to verify that form submissions come from a real visitor.</li>
        </ul>
        <p>
          These providers process data on our behalf and are not permitted to use it for their own purposes.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use privacy-conscious website analytics to understand how the site is used. Analytics events
          never include your email, phone number, or project description.
        </p>

        <h2>Your data</h2>
        <p>
          You can request access to, correction of, or deletion of the information you've submitted at any time
          by contacting us.
        </p>

        <h2>Contact</h2>
        <p v-if="contactChannels.length">
          Reach out via
          <a
            v-for="(channel, i) in contactChannels"
            :key="channel.label"
            :href="channel.href"
          >{{ channel.label }}<span v-if="i < contactChannels.length - 1">, </span></a>.
        </p>
        <p v-else>
          Reach out via the <NuxtLink to="/start-a-project">Start a Project</NuxtLink> form.
        </p>
      </div>
    </BaseSection>
  </div>
</template>
