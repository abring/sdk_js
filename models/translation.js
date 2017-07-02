var initTranslation = function () {
    abring.params.language = 'fa';
    abring.params.translation = {
        "you are not login":{
            "fa":"شما لوین نیستید"
        },
        "do you want to exit?":{
            "fa":"آیا از خروج اطمینان دارید؟"
        },
        "yes":{
            "fa":"بله"
        },
        "no":{
            "fa":"خیر"
        },
        "confirm exit":{
            "fa":"تایید خروج"
        }
    };
};

abring.t = function(source,params,lang){
    var origin_source = source;
    source = source.toLowerCase();
    params = params || {};
    lang = lang || abring.params.language;
    try{
        var t = abring.params.translation[source][lang] || source;
        $.each(params,function(key,value){
            t = t.replaceAll("{"+key+"}",value);
        });
        return t;
    }catch(e)
    {
        return origin_source;
    }
};