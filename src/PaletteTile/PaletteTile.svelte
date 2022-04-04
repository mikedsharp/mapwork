<script lang="ts">
    export let tileCell:number = 0;
    export let tileRow:number = 0;
    export let tilesetPath:string;

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    const tilePositionX = -Math.abs((32 * tileCell))
    const tilePositionY = -Math.abs((32 * tileRow))
    
    function onPaletteTileClick() {
        dispatch('paletteTilePicked', {x: Math.abs(tilePositionX), y: Math.abs( tilePositionY)})
    }
</script>

<div class="palette-tile" on:click={onPaletteTileClick}>
    <img style={`--tileCell:${tilePositionX}px;--tileRow:${tilePositionY}px;`} src={tilesetPath}/>
</div>

<style lang="scss">
 img {
    object-fit: none;
    object-position: var(--tileCell)  var(--tileRow);
    width: 32px;
    height: 32px; 
 }
 .palette-tile {
     padding:4px;
     &:hover {
         background-color: #ccc;
         cursor:pointer;
     }
 } 
</style>