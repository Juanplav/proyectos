function sizeContent() {
    var bodyheight = $(window).height();
    var bodywidth = $(window).width() + "px";
    var nuevoalto = (bodyheight - 20) + "px";
    $("section").css("min-height", nuevoalto);
    $("section").css("width", bodywidth);
}
    
function external(){
    $('a[rel="external"]').attr('target', '_blank');
}

function correos() {
    $('.mailto').each(function(i, ele){
    var texto = $(this).text().replace('[at]', '@').replace('[dot]', '.');
    $(this).html('<a href="mailto:'+texto+'">'+texto+'</a>');
    });
}

function CallXmlById(srcImage){     
    $.ajax({
        url:'works.xml',
        success:function(xml) {
            var work = $(xml).find("work[id="+srcImage+"]");
            $('.desc').append('<h2>'+work.find('title:first').text()+'</h2>');
            var temp='<p>';
            work.find('groups group').each(function(index) {                        
                temp+='<b>'+$(this).find('title').text()+'</b></br>'+$(this).find('content').text()+'</br>';
                });
            if(work.find('tool').length > 0)
                {
                temp+='<b>Herramientas</b>';
                temp+='<ul>';
                work.find('tools tool').each(function(index) {                      
                    temp+='<li>'+$(this).text()+'</li>';
                    });
                    temp+='</ul>';
                }
            $('.desc').append(temp+'</p>');
            work.find('images image').each(function(index) {                        
            $('.detail').append('<img src="'+$(this).text()+'" />');
            });             
            if(work.find('video').length > 0)
            {
                $('.detail').append('<iframe src="http://player.vimeo.com/video/'+work.find('video:first').text()+'?title=0yamp;byline=0yamp;portrait=1yamp;color=59a5d1yamp;autoplay=0" width="100%" height="370" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
            }
        }
    });
}

var quotes=new Array();
    quotes[0]="Inspiration is the seed, <br>design is the fruit.";
    quotes[1]="Design is an opportunity to continue telling the story, not just to sum everything up.";
    quotes[2]="A design isn’t finished until somebody is using it.";
    quotes[3]="Practice safe design: Use a concept.";
