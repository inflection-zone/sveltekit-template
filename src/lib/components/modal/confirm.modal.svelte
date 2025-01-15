<script lang="ts">
	export let show: boolean;
	export let title: string;
	export let message: string;
	export let close: () => void;
	export let confirm: () => void;
	export let confirmButtonText = 'Delete';
	$: show = show;
</script>

{#if show}
	<div class="overlay">
		<div class="modal">
			<h2 class="modal-title">{title}</h2>
			<p class="modal-message">{message}</p>
			<div class="modal-actions">
				<button class="cancel-btn" on:click={close}> Cancel </button>
				<button class="confirm-btn" on:click={confirm}> {confirmButtonText} </button>
			</div>
		</div>
	</div>
{/if}


