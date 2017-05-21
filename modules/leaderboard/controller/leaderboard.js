
/**
 * leaderboard event lister
 */
$(document).on("click",".abring_buttons_leaderboard",function () {
    abringLeaderboardShow();
});
$(document).on("click",".abring_buttons_leaderboard_set_sample_score",function () {
    abringLeaderboardSetScore("leaderboard_25",rand(1,1000));
});
