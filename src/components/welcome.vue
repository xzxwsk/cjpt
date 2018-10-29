<template>
    <div class="welcome">
        <p>hello word</p>
    </div>
</template>

<script>
export default {
    name: 'welcome',
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
