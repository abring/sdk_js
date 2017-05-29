
/**
 * leaderboard functions
 */
var leaderboardView = "";

var initLeaderboard = function () {
    leaderboardView = readFile("abring/modules/leaderboard/view/leaderboard.html");
    $("#"+abring.params.leaderboard.parent_id).html(leaderboardView);
};

var abringLeaderboardShow = function() {

    abring.params.display.showPageFunction("loading","loading leaderboard data.");

    var method = "leaderboard/get-all";
    var data = {};
    callAbringWithFileUpload(
        method,data,
        function (leaderboard_data_tmp) {
            if(leaderboard_data_tmp==undefined || leaderboard_data_tmp==false ||leaderboard_data_tmp=="" )
                return abring.params.display.showPageFunction("error","No leaderboard temp exists!");
            leaderboard_data = leaderboard_data_tmp;
            //display leaderboard
            log(leaderboard_data);
            var leaderboard_data_html = "";
            $.each(leaderboard_data ,function (key,_leaderboard_data) { console.log(_leaderboard_data);
                var leaderboard_id = _leaderboard_data["leaderboard"];
                if(!abring.params.player_info["avatar"])abring.params.player_info["avatar"] = abring.params.abring_default_avatar_url;
                leaderboard_data_html += "<div class='tab "+leaderboard_id+"'>\n";
                leaderboard_data_html += "<div class='my-leaderboard-contain'>\n";
                leaderboard_data_html += "<div class='name view_profile' name='"+abring.params.player_info["player_id"]+"'>"+_leaderboard_data["title"]+"</div>\n";
                leaderboard_data_html += "<img class='avatar view_profile' name='"+abring.params.player_info["player_id"]+"' src="+abring.params.player_info["avatar"]+" />\n";
                leaderboard_data_html += "<div class='rate'>You: "+_leaderboard_data["rate"]+"-</div>\n";
                leaderboard_data_html += "<div class='score'>"+_leaderboard_data["score"]+"</div>\n";
                leaderboard_data_html +="</div>\n";//my-leaderboard-contain
                leaderboard_data_html += "<div class='top_scores'>";
                $.each(_leaderboard_data["top_scores"] ,function (index,leaderboard_top_score_rows) {
                    if(!leaderboard_top_score_rows["player_info"]["avatar"])leaderboard_top_score_rows["player_info"]["avatar"] = abring.params.abring_default_avatar_url;
                    leaderboard_data_html += "<div class='top_score'>";
                    leaderboard_data_html += "<div class='player_rate'>"+(index+1)+"-</div>\n";
                    leaderboard_data_html += "<img name='"+leaderboard_top_score_rows["player_id"]+"' src='"+leaderboard_top_score_rows["player_info"]["avatar"]+"' class='player_avatar view_profile'>\n";
                    leaderboard_data_html += "<div name='"+leaderboard_top_score_rows["player_id"]+"' class='player_name view_profile'>"+leaderboard_top_score_rows["player_info"]["name"]+"</div>\n";
                    leaderboard_data_html += "<div class='player_score'>"+leaderboard_top_score_rows["score"]+"</div>\n";
                    leaderboard_data_html += "</div>";//top_score
                });
                leaderboard_data_html += "</div>";//top_scores
                leaderboard_data_html += "</div>";//tab
            });
            $("#"+abring.params.leaderboard.parent_id+" .leaderbord_display").html(leaderboard_data_html);
            abring.params.display.showPageFunction("leaderboard");
        },
        function (x,c,e) {
            abring.params.display.showPageFunction("error",e);
            return false;
        }
    );
};

var abringLeaderboardSetScore = function (leaderboard,score,signature) {

    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    showLittleTip("Info","submitting your score!","info",10);
    var data = {
        "leaderboard": leaderboard,
        "score":score,
        "signature":signature
    };
    callAbringWithFileUpload("leaderboard/set-score",data,setScoreSuccess,setScoreFail);

    return true;
};
var setScoreSuccess = function (set_score_result) {
    //success
    log("set score result = "+set_score_result);
    //show a little popup without any hesitate to player and fadeout after short time (one seconds)
    showLittleTip("Info","score submitted!","info",2);
    var score = set_score_result["score"];
    var rate = set_score_result["rate"];
    $(".frog_table").html("score="+score+"<br>rate="+rate+"<br>You win!");
    abring.params.display.hidePageFunction();
};
var setScoreFail = function (score_last_error) {
    //failed
    showLittleTip("Info","unable to set score:\n"+score_last_error,"error",2);
    abring.params.display.hidePageFunction();
};