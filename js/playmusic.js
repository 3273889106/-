// 1.歌曲搜索接口
//   请求地址：https://autumnfish.cn/search?keywords="
//   请求方法：get
//   请求参数：keywords（查询关键字）
//   响应内容：歌曲搜索结果
// 5.mv地址获取
// 请求地址："https://autumnfish.cn/mv/url"
// 请求方法：get
// 请求参数：id
// 响应内容：mv的地址
var Event = new Vue();
//事件监听$emit和$on使用借助第三方自定义vue（Event）实例转换
var music = new Vue({
    el:"#insearch",
    data:{
         //接收查询的关键字
        query:" ",
        //存储歌曲数组
        musiclist:[],
    },
    methods:{
        searchmusic:function(){
            var that =this;
            axios.get("https://autumnfish.cn/search?keywords="+this.query)
            .then(function(res){
                that.musiclist = res.data.result.songs;
                Event.$emit('music_msg',that.musiclist);            
            }
            ,function(err){console.log(err)})
        }
    }
})
var list_item = new Vue({
    el:"#search_songs",
    data:{
        //事件监听传送过来的歌曲列表数组
        recievemusiclist:[],
        //音乐url
        musicUrl:"",
        //音乐封面
        musicCover:"",
        //音乐评论数组
        musicComments:[],
        //mvurl
        mvUrl:"",
        //遮罩层的显示状态
        isShow:false,
    },
    mounted(){
        var that =this ;
        //on事件中的第一个参数和emit方法中的参数一致
        Event.$on('music_msg',function(music_msg){
          that.recievemusiclist = music_msg;
        })
    },
    methods:{
        playmusic:function(musicid){
            var that = this;
              axios.get("https://autumnfish.cn/song/url?id="+musicid)
              .then(function(res){
                      that.musicUrl =  res.data.data[0].url;
                      Event.$emit('music_url',that.musicUrl);
              },function(err){
                console.log(err);
              })
                //歌曲详情获取
        axios.get("https://autumnfish.cn/song/detail?ids="+musicid)
        .then(function(response){
           that.musicCover=response.data.songs[0].al.picUrl;
           Event.$emit('musicCover',that.musicCover);
        },function(err){
              console.log(err);
        })
        //歌曲评论获取
        axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicid)
        .then(function(res){
            var that = this;
            that.musicComments=res.data.hotComments;
            Event.$emit('musicComments',that.musicComments);
        }
        ,function(err){console.log(err)})
        }, 
        playmusicmv:function(mvid){
            var that = this;
            axios.get("https://autumnfish.cn/mv/url?id="+mvid)
            .then(function(res){
                that.mvUrl = res.data.data.url;
                that.isShow = true ;
                Event.$emit('mvurl',that.mvUrl);
                Event.$emit('is_show',that.isShow);
            },
            function(err){console.log(err)})
        }
    }
})
var playaudio = new Vue({
    el:"#playaudio",
    data:{
        recievemusicUrl:"",
    },
    mounted(){
        var that = this;
        Event.$on('music_url',function(music_url){
            that.recievemusicUrl = music_url;
        })
    }
})
var musicCover = new Vue({
    el:"#rmusicCover",
    data:{
        rmusicCover:""
    },
    mounted(){
        var that = this;
        Event.$on("musicCover",function(musicCover){
            that.rmusicCover = musicCover;
        })
    }
})
var commentconmentlist = new Vue({
    el:"#commentconmentlist",
    data:{
        rmusicComments:[],
    },
    mounted(){
        var that = this;
        Event.$on('musicComments',function(musicComments){
            that.rmusicComments = musicComments;
        })
    }      
})
var rshow = new Vue({
    el:"#mask",
    data:{
        rshow:false,
        rmvurl:""
    },
    mounted(){
        var that = this;
        Event.$on('mvurl',function(mvurl){
                that.rmvurl = mvurl;
        })
        Event.$on('is_show',function(is_show){
            that.rshow = is_show;
    })
    },
    methods:{
        close:function(){
            this.rshow = false;
            this.rmvurl = "";
        }
    }
})
