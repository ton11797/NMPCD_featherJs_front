<template>
    <span class="chip_component">{{data.value +" "}} <CIcon :content="$options.cilXCircle"/></span>
</template>
<script>
import { cilXCircle } from '@coreui/icons'
export default {
  name: 'chip',
  props: {data:Object},
  cilXCircle: cilXCircle,
}
</script>
<style>
.chip_component {
    align-items: center;
    cursor: default;
    display: inline-flex;
    line-height: 20px;
    max-width: 100%;
    outline: none;
    overflow: hidden;
    padding: 0 12px;
    position: relative;
    text-decoration: none;
    transition-duration: 0.28s;
    transition-property: box-shadow, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: middle;
    white-space: nowrap;
    background-color: #39f;
    border-color: #39f;
    border-radius: 16px;
    font-size: 15px;
    height: 32px;
    color: #FFFFFF;
    caret-color: #FFFFFF;
}
</style>