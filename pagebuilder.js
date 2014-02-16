/**
 * Created by msyk on 2014/02/11.
 */
window.onload = function()  {
    $.ajax({
        url: "page_navi.html",
        type: 'get',
        dataType: 'html',
        success: function (data, status) {
            if (status != 'success')return;
            $('#navigation').html(data);
        }
    });
    $.ajax({
        url: "news.html",
        type: 'get',
        dataType: 'html',
        success: function (data, status) {
            if (status != 'success')return;
            $('#latestnews').html(data);
        }
    });
    $.ajax({
        url: "page_header.html",
        type: 'get',
        dataType: 'html',
        success: function (data, status) {
            if (status != 'success')return;
            $('#page_header').html(data);
            document.getElementById("updatedate").innerHTML = new Date(Date.parse(htmlDocumentModDate));
        }
    });
    if(typeof pageSideOnload === 'function')  {
        pageSideOnload();
    }
}

function showDemoVideo() {
    var win = window.open("../demo2.html", null, "width=800,height=630,toolbar=no,location=no,directories=no,status=no");
}
