

/**
 * post functions
 */
var initPost = function () {

    var postView = readFile(abring_url+"/modules/post/view/post.html");
    $("#abring").append(postView);

    //post_template = $("#abring_posts .timeline").html();
    //var tmp = $("#abring_posts").html();
    //$("#abring_posts").html("");
    //$("#"+abring.params.posts_parent_id).html(tmp);
    //$("#"+abring.params.posts_parent_id+" .timeline *").remove();

};
var abringPostsShow = function () {

    $("#posts .banner").attr("src",abring.params.player_info["timeline_cover"]);

    //show loading page
    abring.params.display.loading.show("loading your timeline");
    $("#"+abring.params.posts_parent_id+" .timeline").html("");

    //fill my timeline page info (avatar banner ...)
    if(abring.params.player_info["post_banner"])
        $("#"+abring.params.posts_parent_id+" .timeline_wall_banner img.banner").attr("src",abring.params.player_info["post_banner"]);
    if(abring.params.player_info["avatar"])
        $("#"+abring.params.posts_parent_id+" .timeline_wall_banner img.avatar").attr("src",abring.params.player_info["avatar"]);

    //get my timeline
    callAbringWithFileUpload("post/timeline" ,false, post_timeline_success,post_timeline_failed);

};
var abringPostPutIntoTimeline = function(post) {
    // log(post);
    var tmp_post_html = post_template;

        if(post['comments'].constructor === Object) {
            tmp_post_html = tmp_post_html.replaceAll('COMMENTS_COUNT', post['comments']['count']);
            if(post['comments']['list'].length>0) {
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_DISPLAY', "block");
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_ID', post['comments']['list'][0]["id"]);
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_CONTENT', post['comments']['list'][0]["comment"]);
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_ID', post['comments']['list'][0]['player_info']["player_id"]);
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_NAME', post['comments']['list'][0]['player_info']["name"]);
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_AVATAR', post['comments']['list'][0]['player_info']["avatar"]);

            }else{
                //clear comment part
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_DISPLAY', "none");
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_CONTENT', "");
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_ID', "");
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_NAME', "");
                tmp_post_html = tmp_post_html.replaceAll('COMMENT_PLAYER_AVATAR', "");
            }
        }

        tmp_post_html = tmp_post_html.replaceAll('PLAYER_ID',post['player_info']['player_id']);
        tmp_post_html = tmp_post_html.replaceAll('POST_ID',post['post_id']);
        tmp_post_html = tmp_post_html.replaceAll('TIME',getPostTimeAgo(post['time']));
        if(post['content']){
            tmp_post_html = tmp_post_html.replaceAll('CONTENT',nl2br(post['content']));
        }else{
            tmp_post_html = tmp_post_html.replaceAll('CONTENT','');
        }
    if(post['shared'].constructor === Object) {
        if(isImage(post['shared']['image']))
        {
            if(post['shared']['image_thumbs'])
                post['shared']['image'] = post['shared']['image_thumbs'][1];
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','<img class="post-img" src="'+post['shared']['image']+'" />');
        }
        else if(isVideo(post['shared']['image']))
        {
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','<video class="post-img" controls><source src="'+post['shared']['image']+'" type="video/mp4">Your browser does not support the video tag.</video>');
        }else{
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','');
        }
        tmp_post_html = tmp_post_html.replaceAll('POST_OWNER','shared from '+post['shared']['player_info']['name']);
        tmp_post_html = tmp_post_html.replaceAll('SHARED_TEMPLATE','block');
        tmp_post_html = tmp_post_html.replaceAll('SHARED_MAIN_IMG','none');
        tmp_post_html = tmp_post_html.replaceAll('SHARED_TEXT',post['shared']['content']); 
        tmp_post_html = tmp_post_html.replaceAll('SHARED_AVATAR',post['shared']['player_info']['avatar']);
        tmp_post_html = tmp_post_html.replaceAll('SHARED_P_ID',post['shared']['player_info']['player_id']);
    }else{
        if(isImage(post['image']))
        {
            if(post['image_thumbs'])
                post['image'] = post['image_thumbs'][1];
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','<img class="post-img" src="'+post['image']+'" />');
        }
        else if(isVideo(post['image']))
        {
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','<video class="post-img" controls><source src="'+post['image']+'" type="video/mp4">Your browser does not support the video tag.</video>');
        }else{
            tmp_post_html = tmp_post_html.replaceAll('IMAGE','');
        }
        tmp_post_html = tmp_post_html.replaceAll('POST_OWNER','');
        tmp_post_html = tmp_post_html.replaceAll('SHARED_TEMPLATE','none');
        tmp_post_html = tmp_post_html.replaceAll('SHARED_MAIN_IMG','block');
    }
        tmp_post_html = tmp_post_html.replaceAll('LIKES',post['likes']);
        tmp_post_html = tmp_post_html.replaceAll('SHARED',post['shared']);
        tmp_post_html = tmp_post_html.replaceAll('TAGS',post['tags']);
        tmp_post_html = tmp_post_html.replaceAll('NAME',post['player_info']['name']);
        tmp_post_html = tmp_post_html.replaceAll('AVATAR',post['player_info']['avatar']);
        tmp_post_html = tmp_post_html.replaceAll('VIEWS',post['views']);










    //fill post in timeline
    $("#"+abring.params.posts_parent_id+" .timeline").append(tmp_post_html);

    if(post['comments'].constructor !== Object || post['comments']['list'].length<=0)
        $("#"+abring.params.posts_parent_id+" .timeline:last .post_comment").html("");
};
var abringPostLike = function(post_id) {
    $(".abring_post_like_this_post[name='"+post_id+"']").parent().children('label').html("updating ...");
    callAbringWithFileUpload("post/like",{"post_id":post_id},abringPostLikeSuccess,abringPostLikeFail,post_id);
};
var abringPostLikeSuccess = function (likes,post_id) {
    console.log(post_id+" likes ="+likes);
    $(".abring_post_like_this_post[name='"+post_id+"']").parent().children('label').html(likes);
};
var abringPostLikeFail = function (xhr, status, error,post_id) {
    console.log(post_id+" like failed");
    $(".abring_post_like_this_post[name='"+post_id+"']").parent().children('label').html("failed");
};

var abringPostShare = function(post_id) {
    $(".abring_post_share_this_post[name='"+post_id+"']").parent().children('label').html("sharing ...");
    callAbringWithFileUpload("post/share",{"post_id":post_id},abringPostShareSuccess,abringPostShareFail,post_id);
};
var abringPostShareSuccess = function (shares,post_id) {
    console.log(post_id+" shares ="+shares);
    $(".abring_post_share_this_post[name='"+post_id+"']").parent().children('label').html(shares);
};
var abringPostShareFail = function (xhr, status, error,post_id) {
    console.log(post_id+" share failed");
};

var post_timeline_success = function(timeline){

    //for each post append post to timeline
    timeline = timeline || {};
    $.each(timeline,function (index,post) {
        abringPostPutIntoTimeline(post);
    });

    //close loading page
    //show post page
    if(abring.params.posts_parent_id=="abring_posts")
        abring.params.display.showPageFunction("post_timeline");
    else
        abringPageHide("loading");

    var allPost = $(".post");
    var allComment = $(".post-more-commnets-contain .post-comment");
    $.each(allPost , function( postIndex , postValue){
        if(postValue.id.indexOf(abring.params.player_info['player_id']) == -1){
            $(postValue).addClass('other-post');
            //log(postValue.class);
        }
        $(".other-post .post-btn-action").hide();
    });
    $.each(allComment , function( commentIndex , commentValue){
        log(commentValue.id+'----'+abring.params.player_info['player_id']);
        if(commentValue.id !== abring.params.player_info['player_id']){
            $(commentValue).addClass('other-comment');
            //log(postValue.class);
        }
        $(".other-comment .comment-btn-action").hide();
    });

};
var post_timeline_failed = function(xhr, status, error){
    log("failed");
    abringPageHide("loading");
};