<template>
    <div class="bd-example">
        <dl>
            <span class="row" v-for="(el,index) in datas" v-bind:key="index">
                <dt class="col-sm-3">{{datas[index].field}}</dt>
                <dd v-if="datas[index].Badge === undefined" class="col-sm-9">{{datas[index].value}}</dd>
                <dd v-if="datas[index].Badge !== undefined" class="col-sm-9"><CBadge :color="datas[index].Badge">{{datas[index].value}}</CBadge></dd>
            </span>
        </dl>
    </div>
</template>
<script>
export default {
  name: 'showDetail',
  props: {datas:Array}
}
</script>