<script lang="ts">
    export let labels;
    export let data1;
    export let data2;
    import JointBarGraph from '$lib/components/vitals.graphs/Joint.Bar.Graph.svelte';
</script>

<div class="h-[400px] w-full">
    <JointBarGraph {labels} {data1} {data2} />
</div>