<template>
    <view class="tarbar">
        <view v-for='(item,index) in datas' @tap="tabClick(index,item.urls,item.id)">
            <u-icon :color="item.color" :name="item.icon" size="60"></u-icon>
            <view v-text="item.name"></view>
        </view>
    </view>
</template>

<script>
    export default {
        props:["totarBer"],//从父组件传来的值 来控制点击当前的颜色
        data() {
            return {
                datas: [{
                        urls: '/pages/home/home',
                        icon: 'home',
                        name: '首页',
                        id: 1,
                    },
                    {
                        urls: '/pages/tcpj/shakeDown',
                        icon: 'order',
                        name: '采购条件',
                        id: 2,
                    },
                    {
                        urls: '/pages/tcpj/orderSucceed',
                        icon: 'checkbox-mark',
                        name: '接单成功',
                        id: 3,
                    },
                ],
            }
        },
        created() {
        //用来控制是显示当前页面的tarBar图标变亮
            if(this.totarBer.id==2){
                this.$set(this.datas[2],'color',this.totarBer.color)
            }
            if(this.totarBer.id==1){
                this.$set(this.datas[1],'color',this.totarBer.color)
            }
           
           
        },
        methods: {
            tabClick(i,urls, id) {
                if(id==1){
                    uni.reLaunch({
                        url: urls
                    });
                }else{
                    uni.navigateTo({
                        url: urls
                    });
                }
               
           
            }
        }
    }
</script>

<style scoped>


    .tarbar {
        width: 50%;
        height: 20rpx;
        display: flex;
        justify-content: space-around;
        background-color: #FFFFFF;
        position: fixed;
        bottom: 0;
        z-index: 100;
        font-size: 30rpx;
        color: #999999;
    }

    .tarbar view {
        text-align: center;
    }
</style>