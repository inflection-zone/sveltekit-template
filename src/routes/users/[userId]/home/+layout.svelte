<script lang="ts">
    import { page } from '$app/stores';
    import type { PageServerData } from './$types';
    ///////////////////////////////////////////////////////////////////////////
    export let data: PageServerData;
    const userId = $page.params.userId;
    let taskHistorylink = `/users/${userId}/home/tasks.history`;
    let vitalsHistorylink = `/users/${userId}/home/vitals.history`;
    let basicStatsLink = `/users/${userId}/home`;
    let activeButton: string = 'basic';
    function setActive(button: string) {
        activeButton = button;
    }
</script>
<div class="tasks">
    <a
        class={`history flex items-center ${activeButton === 'basic' ? 'active' : ''}`}
        href={basicStatsLink}
        on:click={() => setActive('basic')}
    >
        Home
    </a>
    <a
        class={`history ${activeButton === 'taskHistory' ? 'active' : ''}`}
        href={taskHistorylink}
        on:click={() => setActive('taskHistory')}
    >
        Tasks History
    </a>
    <a
        class={`history ${activeButton === 'vitalsHistory' ? 'active' : ''}`}
        href={vitalsHistorylink}
        on:click={() => setActive('vitalsHistory')}
    >
        Vitals History
    </a>
</div>
<slot />