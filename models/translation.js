var initTranslation = function () {
    abring.params.language = 'fa';
    abring.params.translation = {
        "You are not login":{
            "fa":"شما لوین نیستید"
        }
    };
};

abring.t = function(source,lang){
    lang = lang || 'fa';
    try{
        var t = abring.params.translation[source][lang] || source;
        return t;
    }catch(e)
    {
        return source;
    }
};