function showtime(d){
		var nd=new Date(d)
		var y=nd.getUTCFullYear();
		var m=nd.getUTCMonth();
		if(m<10){m='0'+m;}
		var d=nd.getUTCDate();
		if(d<10){d='0'+d;}
		var h=nd.getUTCHours();
		if(h<10){h='0'+h;}
		var mi=nd.getUTCMinutes();
		if(mi<10){mi='0'+mi;}
		var s=nd.getUTCSeconds()
		if(s<10){s='0'+s;}
		var t1=y+'-'+m+'-'+d+' '+h+':'+mi+':'+s;
		var t2=h+':'+mi;
		return t2;
	}
function plotAccordingToChoices(d,placeholder_id,placeholder_text_id) {
        var data = [];
		for(var k in d){
			data.push(d[k]);
		}
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].data.length;j++){
				var t=data[i].data[j][0];
				var ar=t.split(' ');
				var ar_1=ar[0].split('-');
				var y=ar_1[0];
				var m=ar_1[1];
				var d=ar_1[2];
				var ar_2=ar[1].split(':');
				var h=ar_2[0];
				var mi=ar_2[1];
				var s=ar_2[2];
				data[i].data[j][0]=Date.UTC(y,m,d,h,mi,s)
			}
			
		}
        if (data.length > 0)
            $.plot($('#'+placeholder_id), data, {
                yaxis: {},
                xaxis: { mode:'time',tickFormatter:showtime},
				series:{points:{show:false},lines:{show:true}},
				legend:{container:$('#'+placeholder_text_id),noColumns:100},
				grid:{hoverable:true}
            });
    }

