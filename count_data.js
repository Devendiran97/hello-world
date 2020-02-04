var globalsort = 0;
var globalorder = "asc";
var asset_query;
$(document).ready(function () {
    var dom = document.getElementById('search_es');
    if (dom != null)

        getallhosts(0, 18, globalsort, globalorder,asset_query);
    session_check();

    $('#search_es').on('keypress', function (e) {
        if (e.which === 13) {
            getallhosts(0, 18, globalsort, globalorder,asset_query);
            getAssets();
        }

    });
    $('#btn_search').click(function () {
        getallhosts(0, 18, globalsort, globalorder,asset_query);
        getAssets();
    });
    getAssets();



});

function getAssets(){



    let data={};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getAssetList',

        success: function (data) {

            console.log(data);
            let query_string = "";
            data.forEach(function (item) {

                query_string += "host_uuid:\"" + item + "\" OR "

            })
            query_string = query_string.substr(0, query_string.length - 4)
            // console.log(query_string)
            getallhosts(0, 18, globalsort, globalorder, " ("+ query_string+")");


        }
    })
}

function sort_1(i, length) {
    for (var j = 0; j < length; j++)
        if (j != i) {
            $("#column_" + j).removeClass("fa-sort-asc").addClass("fa-sort");

        }
    if ($("#column_" + i).hasClass('fa-sort-asc') == true) {
        $("#column_" + i).removeClass("fa-sort-asc").addClass("fa-sort-desc");
        globalsort = i;
        globalorder = 'desc';
        getallhosts(0, 18, globalsort, globalorder,asset_query);
    } else {
        $("#column_" + i).removeClass("fa-sort-desc").addClass("fa-sort-asc");
        globalsort = i;
        globalorder = 'asc';
        getallhosts(0, 18, globalsort, globalorder,asset_query);
    }
}
var flag = 0;
function create_table(field_header, field, total, sort, page, size) {
    // alert(total)
    var vis=0;
    if ((total / size) < 1)
        total = 1;
    else {
        if (total % size == 0)
            total = parseInt(total / size) - 1;
        else
            total = parseInt(total / size);
    }

    if (total+1 < size)
        vis = total+1;
    else
        vis = 10;
    $('#pagination').twbsPagination('destroy');
    if (page == 0)
        page = 1;


    window.pagObj = $('#pagination').twbsPagination({
        startPage: page,
        totalPages: total,
        visiblePages: vis,
        onPageClick: function (event, page) {
            console.info(page + ' (from event listening)');
        }
    }).on('page', function (event, page) {
        console.info(page + ' (from event listening)');
        getallhosts(page, 18, 1, "asc");
    });


    var table_header = "";
    for (i = 0; i < field_header.length; i++) {
        if (i == sort) {
            if (globalorder == "desc")
                table_header += "<th  onclick='sort_1(" + i + "," + field_header.length + ")'>" + field_header[i] + "<span class='alignright'><i id='Sorting' title='Ascending' class='fa fa-sort-asc'></i></span> </th>";
            // table_header += "<th id='column_" + i + "' onclick='sort_1(" + i + "," + field_header.length + ")' class='sorting_desc' title='Ascending'>" + field_header[i] + "</th>";
            else
                table_header += "<th  onclick='sort_1(" + i + "," + field_header.length + ")'>" + field_header[i] + "<span class='alignright'><i id='Sorting'  title='Descending' class='fa fa-sort-desc'></i></span> </th>";

        }
        else
            table_header += "<th  onclick='sort_1(" + i + "," + field_header.length + ")'>" + field_header[i] + "<span class='alignright'><i id='Sorting' title='Descending' class='fa fa-sort'></i></span></th>";

    }
    table_header = "<thead><tr>" + table_header + "</tr></thead>";
    var table_data = "";

    if (field.length > 0) {
        for (i = 0; i < field.length; i++) {
            var child = field[i];
            table_data += "<tr>"
            for (j = 0; j < child.length; j++) {
                table_data += "<td>" + child[j] + "</td>";
            }
            table_data += "</tr>"
        }
        var table = "<table class='table table-striped table-bordered table-curved dt-responsive nowrap dataTable no-footer dtr-inline'>" + table_header + table_data + "</table>";
        $("#table_holder").html(table);
    }
    else {
        table_data = "<tr><td style='text-align: center'; colspan='" + field_header.length + "'>No Data For Particular Search</td></tr>"
        var table = "<table class='table table-striped table-bordered table-curved dt-responsive nowrap dataTable no-footer dtr-inline'>" + table_header + table_data + "</table>";
        $("#table_holder").html(table);
    }
}
$(window).load(function () {
    Highcharts.setOptions(Highcharts.theme);
    getglobal_1();
    fillcounts_hosts();
    // gethostlist();
    var dom = document.getElementById('search_es');
    if (dom == null) {
        gethighhosts();
        gethighhosts_notable();
    }
    var gte = $("#gte2").val();
    var lte = $("#lte2").val();
    // fillcounts_1();
    general_item_load();

});

function attach_link(uid, time) {
    return '<a href=\'host_detail.html?uid=' + uid + '\'>' + time + '</a>';
}


function convert_array(cols, data,orgin,disabled) {

    var array = '{"table":[';
    data.forEach(function (item) {

        //console.log(item);
        //console.log("-------------------------------------------------");

        array += '[';
        for (i = 0; i < cols.length - 8; i++) {

            if (i == 2) {

                if (item[cols[i]] == '')
                    array += '"' + "0" + '",';
                else
                    array += '"' + parseInt(item[cols[i]]) + '",';
            } else if (cols[i] == 'host_watched') {
                //alert(item[cols[i]]);
                var check_id = item['host_watched'] + "_wat";
                var checked = (item[cols[i]] == true) ? "checked" : "";
                var check1 = "<input id='" + check_id + "' "+disabled+"  value='" + item[cols[8]] + "' type='checkbox' " + checked + " onclick='set_watched_update(this.value)' >";
                array += '"' + check1 + '",';
            }
            else if (cols[i] == 'host_critical') {
                //variablename = (condition) ? value1:value2
                var check_id = item[cols[9]] + "_cri";
                var checked = (item[cols[i]] == true) ? "checked" : "";
                var check1 = "<input id='" + check_id + "' "+disabled+"  value='" + item[cols[8]] + "'  type='checkbox' " + checked + " onclick='set_critical_update(this.value)'  >";
                array += '"' + check1 + '",';
            }
            else if(i==1)
            {
                array += '"' + append_orgin_entry(item,orgin) + '",';
            }
            else if (i == 0) {


                array += '"' + attach_link(item[cols[8]], item[cols[i]]) + '",';
            }
            else
            if (item[cols[i]]==null)
                array += '"' + "" + '",';
            else {
                array += '"' + item[cols[i]] + '",';
            }
        }
        array = array.substr(0, array.length - 1);
        array += '],'
    });
    array = array.substr(0, array.length - 1);
    array += ']}';
    //console.log(array);
    return JSON.parse(array);
}
var host_detail = "";


function getallhosts(page, size, sort, order,asset_query) {
    var lte = new Date().getTime() - time_diff ;
    var gte = lte - (no_of_hours * 3600 * 1000);
    if ($('#search_es').val().length > 0)
        var query_ext = " AND (" + $('#search_es').val() + ")";
    else
        var query_ext = "";
    // var field = ["host_uuid", "host_uuid", "asset_name", "asset_type", "entry_source",  "entry_type", "entry_origin", "entry_uuid", "created_at", "src", "timestamp"];
    // var header = ["host_uuid", "entry_origin", "asset_name", "asset_type", "entry_source", "entry_type"];
    // var orgin=["time_ad","time_dhcp","time_kerberos","time_ldap","time_ntlm","time_radius","time_revdns"];
    var field = ["host_uuid", "host_uuid", "host_score", "host_os", "host_dns_name", "host_description", "host_critical", "host_watched", "host_uuid","time_ad","time_dhcp","time_kerberos","time_ldap","time_ntlm","time_radius","time_revdns"];
    var header = ["host_uuid", "host_origin", "host_score", "host_os", "host_dns_name", "host_description", "host_critical", "host_watched"];
    var orgin=["time_ad","time_dhcp","time_kerberos","time_ldap","time_ntlm","time_radius","time_revdns"];
    if (page == 0)
        page = 1;
    var data = {
        "query": asset_query + query_ext,
        "gte": 0,
        "lte": 0,
        "index": index_hosts,
        "field": field,
        "unique_id": "host_uuid",
        "from": ((page - 1) * 10),
        "size": size,
        "sort": field[sort],
        "order": order,
        "type":"host"
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'table_feed_api',
        success: function (data) {
            console.log(data.result);

            var disabled="";
            if($("#user__type").html()=='Read-only Security Analyst')
                disabled="disabled";

            var all_data = data.result;
            if (all_data.length > 0) {
                var arr = convert_array(field, all_data,orgin,disabled);
                var total = data.total;

                create_table(header, arr.table, total, sort, page,size)
            } else {
                if (typeof(total) == "undefined") {
                    total = 0;
                }
                create_table(header, [], total, 0, page,size)
            }

        }

    });
}


function set_critical_update(uid) {

    var query = "entry_type:" + type_host + " AND host_uuid:" + uid;
    field = ["host_critical"];
    var data = {"query": query, "gte": 0, "lte": 0, "field": field, "type": type_host, "index": index_hosts, "id": uid}
    if($("#user__type").html()=='Read-only Security Analyst')
        message_box("Warning","Permission Denied","ReadOnly User cannot Edit")
    else {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: BASE_URL + 'update_status_flags',
            success: function (data) {
                var result = data.created;

                if (data.created == true)
                // get_critical(uid)
                    location.reload();
            }

        });
    }
}

function set_watched_update(uid) {


    var query = "entry_type:HostType AND host_uuid:" + uid;
    //field=["query_ioa","user_sites","user_uuid","user_id","user_name","user_title","user_score","user_critical","user_watched","timestamp"];
    // field = ["query_incident", "user_sites", "user_uuid", "user_score", "user_critical", "user_watched", "timestamp"];
    field = ["host_watched"];
    var data = {"query": query, "gte": 0, "lte": 0, "field": field, "type": type_host, "index": index_hosts, "id": uid};
    if($("#user__type").html()=='Read-only Security Analyst')
        message_box("Warning","Permission Denied","ReadOnly User cannot Edit")
    else {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: BASE_URL + 'update_status_flags',
            success: function (data) {
                var result = data.created;

                if (data.created == true)
                    location.reload();
                // get_critical(uid)
            }

        });
    }
}
function gethighhosts() {
    //var field=["user_id","user_name","user_title","user_score","user_critical","user_watched","user_uuid"];
    var field = ["host_id", "host_name", "host_dns_name", "host_score", "host_critical", "host_watched", "host_uuid"];
    //var data = {"query": "_type:user", "gte": 0, "lte": 0, "field":field,"dup":"user_uuid"}
    var data = {
        "query": "entry_type:" + type_host + " AND (host_critical:true OR host_watched:true) ",
        "gte": 0,
        "lte": 0,
        "field": field,
        "unique_id": "host_uuid",
        "index": index_hosts
    };

    var host_score;
    var photo;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        // url: BASE_URL + 'getdatafromes',
        url: BASE_URL + 'getdatafromes_notime',
        success: function (data) {

            var html_key = "";
            var html_watched = "";
            var all_data = data.result;
            for (var j = 0; j < all_data.length; j++) {
                if (all_data[j]['host_score'] == '')
                    host_score = 0;
                else
                    host_score = all_data[j]['host_score'];

                photo = hostpng;


                if (all_data[j]['host_critical'] == true) {

                    $("#host_key .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    $("#host_key .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    $("#host_key .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    $("#host_key .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                    $("#host_key .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    if (host_score < 1)
                        $("#host_key .strip").find('.host_score').removeClass('fgc-danger').addClass('fgc-success');
                    else
                        $("#host_key .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                    html_key  += $("#host_key").html();

                }


                if (all_data[j]['host_watched'] == true) {

                    // $("#host_notable .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    // $("#host_notable .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    // $("#host_notable .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    // $("#host_notable .strip .strip-end-content").find('.host_score').html(host_score);
                    // $("#host_notable .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    // if (host_score < 1)
                    //     $("#host_notable .strip").find('.host_score').removeClass('fgc-danger').addClass('fgc-success');
                    // else
                    //     $("#host_notable .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');
                    //
                    //  html_watched += $("#host_notable").html();
                    $("#host_watched .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    $("#host_watched .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    $("#host_watched .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    $("#host_watched .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                    $("#host_watched .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    if (host_score < 1)
                        $("#host_watched .strip").find('.host_score').removeClass('fgc-danger').addClass('fgc-success');
                    else
                        $("#host_watched .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                    html_watched += $("#host_watched").html();

                }

            }

            $("#host_key").removeClass('hidden').html(html_key);
            $("#host_watched").removeClass('hidden').html(html_watched);


        }

    });
}
function gethighhosts_notable() {
    var field = ["host_id", "host_name", "host_dns_name", "host_score", "host_critical", "host_watched", "host_uuid"];
    //var data = {"query": "_type:user", "gte": 0, "lte": 0, "field":field,"dup":"user_uuid"}
    var data = {
        "query": "entry_type:" + type_host + " AND (host_score: >0) ",
        "gte": 0,
        "lte": 0,
        "field": field,
        "unique_id": "host_score",
        "index": index_hosts,
        "size":20,
        "order":"host_score"
    };

    var html_notable = "", html_key = "", html_watched = "";
    var host_score;
    var photo;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getdatafromes_notable',
        success: function (data) {


            var all_data = data.result;
            var count=0;
            if(all_data.length!=0) {
                for (j = 0; j < all_data.length; j++) {
                    // console.log(all_data[j]['host_score']);

                    if (all_data[j]['host_score'] == '-')
                        host_score = 0;
                    else
                        host_score = parseInt(all_data[j]['host_score']);

                    photo = hostpng;
                    if (parseInt(all_data[j]['host_score']) > 0) {
                        count++;
                        $("#host_notable_dash .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                        $("#host_notable_dash .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                        $("#host_notable_dash .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                        $("#host_notable_dash .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                        $("#host_notable_dash .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                        $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                        html_notable += $("#host_notable_dash").html();
                        // html_notable+="<a style='text-decoration: none;color: #ffffff' href='../../host_detail.html?uid="+all_data[j]['host_uuid']+"' class='list__item list-item'><img src='"+photo+"' class='list-item__image'/><div class='list-item__info item-info'><div class='item-info__host'>"+all_data[j]['host_uuid']+"</div></div><div class='list-item__level'><div class='list-item__level_text'>"+host_score+"</div><svg viewBox='0 0 27.046875 13.59375' class='list-item__level_back'><polygon class='level_back' points='2.1750000000000003,0 27.046875,0 27.046875,11.41875 24.871875,13.59375 0,13.59375 0,2.1750000000000003 2.1750000000000003,0'></polygon></svg></div></a>"
                    }


                }
                $("#notable_host_count").html(count)
                $("#host_notable_dash").removeClass('hidden').html(html_notable);
            }else
                gethighhosts_dash();



        }

    });
}

function gethighhosts_dash() {
    //var field=["user_id","user_name","user_title","user_score","user_critical","user_watched","user_uuid"];
    var field = ["host_id", "host_name", "host_dns_name", "host_score", "host_critical", "host_watched", "host_uuid"];
    //var data = {"query": "_type:user", "gte": 0, "lte": 0, "field":field,"dup":"user_uuid"}
    var data = {
        "query": "entry_type:" + type_host + " AND (host_critical:true OR host_watched:true) ",
        "gte": 0,
        "lte": 0,
        "field": field,
        "unique_id": "host_uuid",
        "index": index_hosts
    };

    var host_score;
    var photo;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        // url: BASE_URL + 'getdatafromes',
        url: BASE_URL + 'getdatafromes_notime',
        success: function (data) {

            var html_key = "";
            var max_show = 5;
            var all_data = data.result;
            if(all_data.length<5)
                max_show=all_data.length;
            else
                max_show=5
            for (var j = 0; j < max_show; j++) {
                if (all_data[j]['host_score'] == '')
                    host_score = 0;
                else
                    host_score = all_data[j]['host_score'];

                photo = hostpng;


                if (all_data[j]['host_critical'] == true) {

                    $("#host_notable_dash .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    $("#host_notable_dash .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    $("#host_notable_dash .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    $("#host_notable_dash .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                    $("#host_notable_dash .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    if (host_score < 1)
                        $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-danger').addClass('fgc-success');
                    else
                        $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                    html_key  += $("#host_notable_dash").html();

                }


                else   if (all_data[j]['host_watched'] == true) {


                    $("#host_notable_dash .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    $("#host_notable_dash .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    $("#host_notable_dash .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    $("#host_notable_dash .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                    $("#host_notable_dash .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    if (host_score < 1)
                        $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-danger').addClass('fgc-success');
                    else
                        $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                    html_key += $("#host_notable_dash").html();

                }

            }

            $("#host_notable_dash").removeClass('hidden').html(html_key);
            // $("#host_watched").removeClass('hidden').html(html_watched);


        }

    });
}
function gethighhosts_notable_dash() {
    var field = ["host_id", "host_name", "host_dns_name", "host_score", "host_critical", "host_watched", "host_uuid"];
    //var data = {"query": "_type:user", "gte": 0, "lte": 0, "field":field,"dup":"user_uuid"}
    var data = {
        "query": "entry_type:" + type_host + " AND (host_score: >0) ",
        "gte": 0,
        "lte": 0,
        "field": field,
        "unique_id": "host_score",
        "index": index_hosts,
        "size":20,
        "order":"host_score"
    };

    var html_notable = "", html_key = "", html_watched = "";
    var host_score;
    var photo;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getdatafromes_notable',
        success: function (data) {


            var all_data = data.result;
            for (j = 0; j < all_data.length; j++) {
                // console.log(all_data[j]['host_score']);

                if (all_data[j]['host_score'] == '-')
                    host_score = 0;
                else
                    host_score = all_data[j]['host_score'];

                photo = hostpng;
                if (parseInt(all_data[j]['host_score']) > 0) {

                    $("#host_notable_dash .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                    $("#host_notable_dash .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                    $("#host_notable_dash .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                    $("#host_notable_dash .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                    $("#host_notable_dash .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                    $("#host_notable_dash .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                    html_notable += $("#host_notable_dash").html();

                }


            }

            $("#host_notable_dash").removeClass('hidden').html(html_notable);


        }

    });
}


function get_host_changers(query) {

    var field = ["host_id", "host_name", "host_dns_name", "host_score", "host_critical", "host_watched", "host_uuid"];
    //var data = {"query": "_type:user", "gte": 0, "lte": 0, "field":field,"dup":"user_uuid"}
    var data = {
        "query": query,
        "gte": 0,
        "lte": 0,
        "field": field,
        "unique_id": "host_score",
        "index": index_hosts,
        "size":20,
        "order":"host_score"
    };

    var html_notable = "";
    var host_score;
    var photo;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getdatafromes_notable',
        success: function (data) {

            var all_data = data.result;
            for (var j = 0; j < all_data.length; j++) {


                if (all_data[j]['host_score'] == '-')
                    host_score = 0;
                else
                    host_score = all_data[j]['host_score'];

                photo = hostpng;
                // if (parseInt(all_data[j]['host_score']) > 0) {

                $("#host_changers .strip .strip-start-content").find('img.host_photo').attr('src', photo);
                $("#host_changers .strip .strip-content").find(".host_name").html(all_data[j]['host_uuid']);
                $("#host_changers .strip .strip-content").find(".host_title").html(all_data[j]['host_dns_name']);
                $("#host_changers .strip .strip-end-content").find('.host_score').html(parseInt(host_score));
                $("#host_changers .strip .host_link").attr('href', 'host_detail.html?uid=' + all_data[j]['host_uuid']);
                $("#host_changers .strip").find('.host_score').removeClass('fgc-success').addClass('fgc-danger');

                html_notable += $("#host_changers").html();

            }


            // }

            $("#host_changers").removeClass('hidden').html(html_notable);


        }

    });
}

function session_check() {

    var data;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getsession',
        success: function (data) {
            //alert(data);
            if (data == 'Read-only Security Analyst') {

                $('input[type=checkbox]').attr('disabled', 'true');

            }

        }
    });
}
function fillcounts_hosts() {
    var data = {"query": "*", "gte": 0, "lte": 0, "field": "orig_user"};
    var str = "";
    var query ="( admin_state:IncidentReported OR admin_state:IncidentInvestigation) AND -category:Test";
    var data = {
        "query": query,
        "gte": 0,
        "lte": 0,
        "field": "entry_uuid",
        "type": type_incident
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getcounts_incident',
        async: true,
        success: function (data) {
            ////////console.log("User Count"+data.Count);
            //arr[4]=data.Count;

            $("#threat").html(data.Count.toLocaleString());
            $("#threat_h").val(data.Count);
        }
    });


    // var data = {"query": "*", "gte": 0, "lte": 0, "index": index_ioas, "type": type_ioa}
    var data = {"query": "*", "gte": 0, "lte": 0, "index": index_ioas, "type": "EventType"}
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'gettotcount',
        success: function (data) {

            $("#threateval_h").val(data.Count);
            if (data.Count > 1000000)
                $("#threateval").html(Math.floor((data.Count) / 1000).toLocaleString() + "K");
            else
                $("#threateval").html(data.Count.toLocaleString());
            //    $("#threateval_h").val(data.Count);
        }
    });


    var lte = new Date().getTime() - time_diff ;
    var gte = lte - (no_of_hours * 3600 * 1000);

    var data = {"query": "entry_type:" + type_host, "gte": 0, "lte": 0, "index": index_hosts, "field": "host_uuid"}
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: BASE_URL + 'getcounts_host',
        async: true,
        success: function (data) {


            $("#hostcount").html(data.Count.toLocaleString());
            $("#hostcount_h").val(data.Count);
        }
    });

}
