<script lang="ts">
    import { browser } from "$app/environment";
    import { db } from "$lib/utils.ts/local.db";
    import { Helper } from "$lib/utils.ts/helper";
    export let source;
    export let cls;
    export let w;
    export let h;
    
    let objectUrl;
    async function loadImage() {
        if (!source) {
            return;
        }
        const url = source?.toLowerCase();
        if (browser) {
            const x = await db.imageCache
                    .where({
                        srcUrl: url
                    }).first();
            console.log(`x = ${JSON.stringify(x)}`);
            if (x && !Helper.isEmpty(x)) {
                const blob = new Blob([x.blb],{ type: x.contentType});
                objectUrl = URL.createObjectURL(blob);
                console.log(`extracting existing image from cache!  ${JSON.stringify(objectUrl)}`);
            } else {
                const res = await fetch(source)
                const blb = await res.blob();
                objectUrl = URL.createObjectURL(blb);
                await db.imageCache.add({
                    srcUrl: url,
                    blb: await blb.arrayBuffer(),
                    contentType:blb.type
                });
                console.log(`Added new image to imageCache! ${JSON.stringify(blb)}`);
            }
        }
        else {
            const res = await fetch(source)
            const blb = await res.blob();
            objectUrl = URL.createObjectURL(blb);
        }
    }
    (async () => {
        await loadImage();
    })();
</script>
<img src={objectUrl} alt="" class={cls} width="{w}" height="{h}"/>

