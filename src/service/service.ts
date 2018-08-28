export var modals={ 
        model: 0, //0隐藏 1展示
        cartImg:'',//弹出框图片
        ordertype:'',
        select_type:"",
        FP_PRICE:'',
        PRODUCT_NAME:'',
        PRODUCT_NO:'',
        value:{},//接收点击商品传过来的值
        colorCheck:false,//判断是否已选颜色
        sizeCheck:false,//判断是否已选尺码
        typeGroup:{
          color:'', //颜色
          size:'',//尺码
          colorId:'',
          sizeId:''
        },
         UNI_NO:'',//产品Id 都用这个
        colorGroup1:[],//颜色组
        sizeGroup1:[],//尺码组
        colorArray:[],
        sizeArray:[],
        result:[],
//购物清单
        shopArray:[],
         goodList:{}
}