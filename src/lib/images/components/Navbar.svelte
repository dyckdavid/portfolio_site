<script lang="ts">
  import { page } from '$app/stores'; // Use SvelteKit's $page store
  import { onMount } from 'svelte';

  // Function to normalize paths
  function normalizePath(path: string): string {
    return path.replace(/\/+$/, '') || '/';
  }

  // Reactive variables to determine if a link is active
  $: currentPath = normalizePath($page.url.pathname);
  $: isActiveHome = currentPath === '/';
  $: isActiveProjects = currentPath === '/projects';

  // Debugging logs
  $: console.log('Current Path:', currentPath);
  $: console.log('isActiveHome:', isActiveHome, 'isActiveProjects:', isActiveProjects);

  // Existing variables and functions
  let isOpen = false;
  let isProfileOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function toggleProfileMenu() {
    isProfileOpen = !isProfileOpen;
  }

  // Close the profile menu when clicking outside
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && target && !target.closest('#user-menu-button')) {
        isProfileOpen = false;
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<nav class="bg-gray-900">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <!-- Mobile menu button -->
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          on:click={toggleMenu}
          type="button"
          class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span class="absolute -inset-0.5"></span>
          <span class="sr-only">Open main menu</span>
          <svg
            class="{isOpen ? 'hidden' : 'block'} h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
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
            stroke-width="1.5"
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
            class="h-8 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <!-- Home Link -->
            <a
              href="/"
              class="rounded-md px-3 py-2 text-sm font-medium"
              class:bg-gray-900={isActiveHome}
              class:text-white={isActiveHome}
              class:text-gray-300={!isActiveHome}
              class:hover:bg-gray-700={!isActiveHome}
              class:hover:text-white={!isActiveHome}
              aria-current={isActiveHome ? 'page' : undefined}
            >
              Home
            </a>
            <!-- Projects Link -->
            <a
              href="/projects"
              class="rounded-md px-3 py-2 text-sm font-medium"
              class:bg-gray-900={isActiveProjects}
              class:text-white={isActiveProjects}
              class:text-gray-300={!isActiveProjects}
              class:hover:bg-gray-700={!isActiveProjects}
              class:hover:text-white={!isActiveProjects}
              aria-current={isActiveProjects ? 'page' : undefined}
            >
              Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if isOpen}
    <div class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Home Link -->
        <a
          href="/"
          class="block rounded-md px-3 py-2 text-base font-medium"
          class:bg-gray-900={isActiveHome}
          class:text-white={isActiveHome}
          class:text-gray-300={!isActiveHome}
          class:hover:bg-gray-700={!isActiveHome}
          class:hover:text-white={!isActiveHome}
          aria-current={isActiveHome ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          Home
        </a>
        <!-- Projects Link -->
        <a
          href="/projects"
          class="block rounded-md px-3 py-2 text-base font-medium"
          class:bg-gray-900={isActiveProjects}
          class:text-white={isActiveProjects}
          class:text-gray-300={!isActiveProjects}
          class:hover:bg-gray-700={!isActiveProjects}
          class:hover:text-white={!isActiveProjects}
          aria-current={isActiveProjects ? 'page' : undefined}
          on:click={() => { isOpen = false; }}
        >
          Projects
        </a>
      </div>
    </div>
  {/if}
</nav>
