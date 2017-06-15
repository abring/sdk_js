var initTranslation = function () {
    abring.params.language = 'fa';
    abring.params.translation = {
        "You are not login":{
            "fa":"شما لوین نیستید"
        }
    };
};

abring.t = function(source,params,lang){
    params = params || {};
    lang = lang || 'fa';
    try{
        var t = abring.params.translation[source][lang] || source;
        $.each(params,function(key,value){
            t = t.replaceAll("{"+key+"}",value);
        });
        return t;
    }catch(e)
    {
        return source;
    }
};