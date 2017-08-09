//下拉選單
var area = document.getElementById('s-area');
var desinfo = document.querySelector('.desinfo');

//撈取資料
var url = 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json'; //來源網址
var data = []; //儲存陣列
var content; //

//地圖
var map;
//記錄載入的 marker
var markers = [];
//記錄點擊的 google window
var currentInfoWindow = '';

getData();

//建立地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 25.088327407836914,
            lng: 121.51248168945313
        },
        zoom: 11
    });

}


function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send(null);
    xhr.onload = function() {
        content = JSON.parse(xhr.responseText);
        data = content.DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
        initMap();
        uploadOption();
        clearArea();
    };
}

function clearArea(){
  console.log(markers.length);
  for(var i=0;markers.length>i;i++){
    markers[i].setMap(null);
  }
}

//點擊下拉選單，清除marker在重新載入
area.addEventListener('change', loadingArea, false);
function loadingArea(e){
  clearArea();
  
       // 載入資料
   for(var i=0;data.length>i;i++){
      if(e.target.value == data[i].CaseLocationDistrict){
        loadData(data[i].Wgs84Y, data[i].Wgs84X, data[i].CaseLocationDistrict,data[i].PName,data[i].CaseLocationDescription);
      }
    }
}

area.addEventListener('change',updataList,false);

function updataList(e){
  var select = e.target.value;
  var str = '';
	for(var i = 0;i<data.length;i++){
		if(select == data[i].CaseLocationDistrict){
			str+= '<tr><td>'+data[i].CaseTime+'</td><td><span class="tag">'+data[i].CaseLocationDistrict+'</span></td><td>'+data[i].CaseLocationDescription+'</td><td>'+data[i].CaseDescription+'</td></tr>';
		}
	}
  desinfo.innerHTML ='<tr><th>發生時間</th><th>區域</th><th>詳細位置</th><th>描述</th></tr>'+str;
};


function loadData(lat, lng, title, staus, location) {
    var marker = new google.maps.Marker({
        position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        },
        title: title,
        staus: staus,
        location: location,
        map: map
    });
    markers.push(marker);
    console.log(staus);
  
        var contentString ='<div class="setContent">' +
                  '<h2>' + title + '</h2>' +
                  '<p>' + '類別：' + staus + '</p>' +
                  '<p>' + '詳細位置：' + location + '</p>' +
                  '</div>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
  
    //點擊marker時，跳出資訊視窗
  marker.addListener('click', function() {
         if(currentInfoWindow != '')   
      {    
        currentInfoWindow.close();   
        currentInfoWindow = '';   
      }   
      infowindow.open(map, marker);   
      currentInfoWindow = infowindow; 
  });
}

function uploadOption() {
    var option = '';
    var selectItem = [];
    for (var i = 0; data.length > i; i++) {
        if (selectItem.indexOf(data[i].CaseLocationDistrict) == -1) {
            selectItem.push(data[i].CaseLocationDistrict);
        }
    }

    for (var i = 0; i < selectItem.length; i++) {
        option += '<option>' + selectItem[i] + '</option>';
    }
    area.innerHTML = '<option disabled selected value> -- 請選擇行政區 -- </option>' + option;
};
