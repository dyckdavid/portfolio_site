<script lang="ts">
  import { page } from '$app/stores'; // Use SvelteKit's $page store
  import Logo from '../../../lib/images/LOGO.png';

  // Function to normalize paths
  function normalizePath(path: string): string {
    return path.replace(/\/+$/, '') || '/';
  }

  // Reactive variables to determine if a link is active
  $: currentPath = normalizePath($page.url.pathname);
  $: isActiveHome = currentPath === '/';
  $: isActiveProjects = currentPath === '/projects';
  $: isActiveSkills = currentPath === '/skills';
  $: isActiveContact = currentPath === '/contact';

  // Debugging logs
  // $: console.log('Current Path:', currentPath);
  // $: console.log('isActiveHome:', isActiveHome, 'isActiveProjects:', isActiveProjects);

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<nav class="bg-hacker-black border-b-2 border-hacker-green shadow-hacker">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <!-- Mobile menu button -->
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          on:click={toggleMenu}
          type="button"
          class="relative inline-flex items-center justify-center p-2 text-hacker-green hover:text-hacker-green-bright focus:outline-none border border-hacker-green hover:shadow-hacker-glow transition-all"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="{isOpen ? 'hidden' : 'block'} h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            class="{isOpen ? 'block' : 'hidden'} h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Logo and navigation links -->
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex flex-shrink-0 items-center">
          <img
            class="h-10 w-auto rounded-full border-2 border-hacker-green shadow-hacker-glow"
            src={Logo}
            alt="David's Logo"
          />
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-1">
            <!-- Home Link -->
            <a
              href="/"
              class="px-4 py-2 text-sm font-mono font-bold border border-hacker-green transition-all"
              class:bg-hacker-green={isActiveHome}
              class:text-hacker-black={isActiveHome}
              class:text-hacker-green={!isActiveHome}
              class:shadow-hacker-glow={isActiveHome}
              class:hover:bg-hacker-green={!isActiveHome}
              class:hover:text-hacker-black={!isActiveHome}
              class:hover:shadow-hacker={!isActiveHome}
              aria-current={isActiveHome ? 'page' : undefined}
            >
              &gt; HOME
            </a>
            <!-- Projects Link -->
            <a
              href="/projects"
              class="px-4 py-2 text-sm font-mono font-bold border border-hacker-green transition-all"
              class:bg-hacker-green={isActiveProjects}
              class:text-hacker-black={isActiveProjects}
              class:text-hacker-green={!isActiveProjects}
              class:shadow-hacker-glow={isActiveProjects}
              class:hover:bg-hacker-green={!isActiveProjects}
              class:hover:text-hacker-black={!isActiveProjects}
              class:hover:shadow-hacker={!isActiveProjects}
              aria-current={isActiveProjects ? 'page' : undefined}
            >
              &gt; PROJECTS
            </a>
            <!-- Skills Link -->
            <a
              href="/skills"
              class="px-4 py-2 text-sm font-mono font-bold border border-hacker-green transition-all"
              class:bg-hacker-green={isActiveSkills}
              class:text-hacker-black={isActiveSkills}
              class:text-hacker-green={!isActiveSkills}
              class:shadow-hacker-glow={isActiveSkills}
              class:hover:bg-hacker-green={!isActiveSkills}
              class:hover:text-hacker-black={!isActiveSkills}
              class:hover:shadow-hacker={!isActiveSkills}
              aria-current={isActiveSkills ? 'page' : undefined}
            >
              &gt; SKILLS
            </a>
            <!-- Contact Link -->
            <a
              href="/contact"
              class="px-4 py-2 text-sm font-mono font-bold border border-hacker-green transition-all"
              class:bg-hacker-green={isActiveContact}
              class:text-hacker-black={isActiveContact}
              class:text-hacker-green={!isActiveContact}
              class:shadow-hacker-glow={isActiveContact}
              class:hover:bg-hacker-green={!isActiveContact}
              class:hover:text-hacker-black={!isActiveContact}
              class:hover:shadow-hacker={!isActiveContact}
              aria-current={isActiveContact ? 'page' : undefined}
            >
              &gt; CONTACT
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if isOpen}
    <div class="sm:hidden border-t-2 border-hacker-green" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Home Link -->
        <a
          href="/"
          class="block px-3 py-2 text-base font-mono font-bold border border-hacker-green transition-all"
          class:bg-hacker-green={isActiveHome}
          class:text-hacker-black={isActiveHome}
          class:text-hacker-green={!isActiveHome}
          class:hover:bg-hacker-green={!isActiveHome}
          class:hover:text-hacker-black={!isActiveHome}
          aria-current={isActiveHome ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          &gt; HOME
        </a>
        <!-- Projects Link -->
        <a
          href="/projects"
          class="block px-3 py-2 text-base font-mono font-bold border border-hacker-green transition-all"
          class:bg-hacker-green={isActiveProjects}
          class:text-hacker-black={isActiveProjects}
          class:text-hacker-green={!isActiveProjects}
          class:hover:bg-hacker-green={!isActiveProjects}
          class:hover:text-hacker-black={!isActiveProjects}
          aria-current={isActiveProjects ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          &gt; PROJECTS
        </a>
        <!-- Skills Link -->
        <a
          href="/skills"
          class="block px-3 py-2 text-base font-mono font-bold border border-hacker-green transition-all"
          class:bg-hacker-green={isActiveSkills}
          class:text-hacker-black={isActiveSkills}
          class:text-hacker-green={!isActiveSkills}
          class:hover:bg-hacker-green={!isActiveSkills}
          class:hover:text-hacker-black={!isActiveSkills}
          aria-current={isActiveSkills ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          &gt; SKILLS
        </a>
        <!-- Contact Link -->
        <a
          href="/contact"
          class="block px-3 py-2 text-base font-mono font-bold border border-hacker-green transition-all"
          class:bg-hacker-green={isActiveContact}
          class:text-hacker-black={isActiveContact}
          class:text-hacker-green={!isActiveContact}
          class:hover:bg-hacker-green={!isActiveContact}
          class:hover:text-hacker-black={!isActiveContact}
          aria-current={isActiveContact ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          &gt; CONTACT
        </a>
      </div>
    </div>
  {/if}
</nav>
