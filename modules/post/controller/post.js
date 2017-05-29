

/**
 * posts event lister
 */
$(document).on("click",".abring_buttons_posts_timeline",function () {
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    abringPostsShow();
});
$(document).on("keyup","#abring_post_search_input",function (e) {
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    var tag  = $("#abring_post_search_input").val();
    if(tag.length<2)
        return;
    callAbringWithFileUpload("post/tags",{"tag":tag},
        function (suggested_tags) {
            $("#abring_post_tag_suggestion").html("");
            $.each(suggested_tags ,function (index,suggested_tag) {
                $("#abring_post_tag_suggestion").append("<div id='abring_suggested_tag'>"+suggested_tag+"</div>");
            });
        },function (x,c,e) {

        }
    );
});
$(document).on("click","#abring_suggested_tag",function (e) {
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $("#abring_post_search_input").val($(this).html());
    $("#abring_post_tag_suggestion").html("");
    var tag  = $("#abring_post_search_input").val();
    callAbringWithFileUpload("post/search",{"tag":tag},
        function (search_result_posts) {
            $("#"+abring.params.posts_parent_id+" .timeline").html("");
            $.each(search_result_posts,function (index,search_result_post) {
                log(search_result_post);
                abringPostPutIntoTimeline(search_result_post);
            });
        },function (x,c,e) {

        }
    );
});
$(document).on("click",".abring_post_like_this_post",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    var post_id = $(this).attr("name");
    abringPostLike(post_id);
});
$(document).on("click",".abring_post_share_this_post",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    var post_id = $(this).attr("name");
    abringPostShare(post_id);
});
$(document).on("click","#abring_post_create",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(this).hide();
    $(".abring_post_create_form").show("slow");
});
$(document).on("click","#abring_post_create_submit",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(".abring_post_create_form").hide();
    abring.params.display.showPageFunction("loading");

    var image = $("#abring_post_create_image")[0].files[0];
    var content = $("#abring_post_create_content").val();
    var tags = $("#abring_post_create_tags").val();

    if(!image||!content)
    {
        abringPageHide("loading");
        alert("image or content not set");
        $("#abring_post_create").show("slow");
        return;
    }

    var data = {
        "image":image,
        "content":content,
        "tag":tags
    };
    callAbringWithFileUpload("post/create",data,function (data) {
        log("Success");
        abringPostsShow();
        abringPageHide("loading");
        $("#abring_post_create").show("slow");
    },function (xhr, status, error) {
        log("failed");
        abringPageHide("loading");
        $("#abring_post_create").show("slow");
    });
});
$(document).on("click","#abring_post_create_cancel",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(".abring_post_create_form").hide();
    $("#abring_post_create").show("slow");
});
$(document).on("click",".post_comment_add",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    if($(this).parent().children('input').val() == ''){
        alert('comment input is empty. please fill it');
    }else{
        $(this).parent().parent().parent().parent().addClass('current-post');
        post_id = $(".current-post").attr('id');
        comment = $(this).parent().children('input').val();
        callAbringWithFileUpload("post/comment",{"post_id":post_id,"comment":comment},
            function (post_comment_result) {
                $(".current-post .post-more-commnets-contain").prepend('<div class="post-comment player_'+abring.params.player_info.id+'" style="display:block;"><div class="avatar-box"> <img class="post-more-comment-avatar view_profile" name="'+abring.params.player_info.id+'" src="'+abring.params.player_info.avatar+'"> <label class="post-more-comment-name view_profile" name="'+abring.params.player_info.id+'">'+abring.params.player_info.name+'</label></div><div class="comment-box"><p class="post-more-comment-content">'+comment+'</p></div></div>');
                $(".current-post").removeClass("current-post");
            },function (x,c,e) {
                abring.params.display.showPageFunction("error",c);
            }
        );
    }
});
$(document).on("click",".post_delete",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(this).parent().parent().addClass('current-post');
    post_id = $(".current-post").attr('id');
    callAbringWithFileUpload("post/delete",{"post_id":post_id},
        function (post_delete_result) {
            $(".current-post").remove();
            log(post_delete_result);
        },function (x,c,e) {

        }
    );
});
var limit = 10;
var offset =1;
$(document).on("click",".post_comments_more",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(this).parent().parent().parent().addClass('current-post');
    post_id = $(".current-post").attr('id');
    callAbringWithFileUpload("post/comment-list",{"post_id":post_id , limit: limit, offset: offset },
        function (post_more_result) {

            offset = offset + limit;
            limit = limit * 2;

            if(post_more_result.count !== "0"){
                $.each(post_more_result.list,function(moreIndex , moreVlaue){ log(moreVlaue.player_info);
                    $(".post-more-commnets-contain").append('<div class="post-comment player_848451114/1492425786" style="display:block;"><div class="avatar-box"><img class="post-more-comment-avatar" src="'+moreVlaue.player_info.avatar+'"><label class="post-more-comment-name">'+moreVlaue.player_info.name+'</label></div><div class="comment-box"><p class="post-more-comment-content">'+moreVlaue.comment+'</p></div></div>');
                });
            }else{

            }

        },function (x,c,e) {

        }
    );
});
$(document).on("click",".post_edit",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(this).parent().parent().addClass('current-post');
    var postIdea = $(".current-post .post-content-div .post-content").html();
    var postTags = $(".current-post .post-tags-p").html();
    var postImage = $(".current-post .post-img-div .post-img").attr('src');
    postTags = postTags.replace(/,/g, "#");
    $(".current-post .abring_post_edit_content").val(br2ln(postIdea));
    $(".current-post .abring_post_edit_tags").val(postTags);
    $(".current-post .abring_post_edit_image").parent().prepend('<img class="sub-image" style="width: 100%" src="'+postImage+'" />');

    $(".current-post .post-content").hide(300);
    $(".current-post .post-time-label").hide();
    $(".current-post .post_edit").hide();
    $(".current-post .abring_post_edit_form").show(300);
});
$(document).on("click",".abring_post_edit_submit",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    $(".abring_post_edit_form").hide();
    abring.params.display.showPageFunction("loading");

    var image = $(".current-post .abring_post_edit_image")[0].files[0];
    var content = $(".current-post .abring_post_edit_content").val();
    var tags = $(".current-post .abring_post_edit_tags").val();

    if(!image||!content)
    {
        var data = {
            "content":content,
            "tag":tags,
            "post_id": $(".current-post .edit-post-id").val()
        };
    }else{
        var data = {
            "image":image,
            "content":content,
            "tag":tags,
            "post_id": $(".current-post .edit-post-id").val()
        };
    }


    callAbringWithFileUpload("post/update",data,function (data) {
        log("Success");

        abringPostsShow();
        abringPageHide("loading");

    },function (xhr, status, error) {
        log("failed");
        abringPageHide("loading");
        $(".current-post .abring_post_edit_form").hide(300);
        $(".current-post .post-content").show(300);
        $(".current-post .post-time-label").show();
        $(".current-post .post_edit").show();
    });
});
$(document).on("click",".abring_post_edit_cancel",function (e){
    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }

    $(".current-post .abring_post_edit_content").val('');
    $(".current-post .abring_post_edit_tags").val('');
    $(".current-post .sub-image").remove();

    $(".current-post .abring_post_edit_form").hide(300);
    $(".current-post .post-content").show(300);
    $(".current-post .post-time-label").show();
    $(".current-post .post_edit").show();
    $(".current-post").removeClass('current-post');
});
$(document).on("click",".abring_post_comment_edit",function(){
    var commentContent = $(this).parent().parent().children('.post-more-comment-content-span').html();
    $(this).parent().parent().html('<input type="text" value="'+commentContent+'" /><a class="btn abring_post_comment_send_edit" style="width: 100%">edit</a>');
});
$(document).on("click",".abring_post_comment_send_edit",function(){
    var comment_id = $(this).parent().attr('id');
    var post_id =  $(this).parent().parent().attr('id');
    post_id = post_id.split('post-');
    post_id = post_id[1];
    var commentContent = $(this).parent().children('input').val();
    callAbringWithFileUpload("post/comment-edit",{"post_id":post_id , comment_id: comment_id, comment: commentContent },
        function (send_edited_comment) {

            $(this).parent().html('');
            $("#"+comment_id).append('<span class="post-more-comment-content-span">'+commentContent+'</span><span class="comment-btn-action"><a style="margin-left: 3px;" class="abring_post_comment_edit" href="#">edit</a><a style="margin-left: 3px;" class="abring_post_comment_delete" href="#">delete</a></span>');
        },function (x,c,e) {

        }
    );
});
$(document).on("click",".abring_post_comment_delete",function(){
    var post_id =  $(this).parent().parent().parent().attr('id');
    post_id = post_id.split('post-');
    post_id = post_id[1];
    var comment_id = $(this).parent().parent().attr('id');
    callAbringWithFileUpload("post/comment-delete",{"post_id":post_id , comment_id: comment_id },
        function (send_deleted_comment) {
            $(this).parent().parent().parent().parent().remove();
            log(send_deleted_comment);
        }
    );
});
