<template>
    <div class="welcome">
        <p>正在建设中...</p>
    </div>
</template>

<script>
export default {
    name: 'building',
    data () {
        return {}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.welcome{
    display: flex; flex-direction: column; justify-content: center; height: 100%;
    p{font-size: 50px; font-weight: bold; height: 30px; text-align: center;}
}
</style>
