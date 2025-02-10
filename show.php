<?php

set_time_limit(0);
header("Content-Type:text/html;charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 假設 $request->url 是您要抓取的 URL，可以用 GET 請求傳遞
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['url'])) {
        $url = $data['url'];

        // 取得網頁內容
        $html = file_get_contents("compress.zlib://" . $url);
        
        // 創建 DOMDocument 來解析 HTML
        $dom = new DOMDocument;
        @$dom->loadHTML($html);
        
        // 找到所有的 <li> 標籤
        $li = $dom->getElementsByTagName("li");
        
        // 初始化 API 數組
        $api = array();
        
        // 迭代 <li> 標籤，並解析其中的 <a> 標籤
        foreach ($li as $key => $value) {
            $a = $value->getElementsByTagName("a");
            foreach ($a as $item) {
                // 將連結的名稱和 href 屬性加入到數組中
                array_push($api, array(
                    'name' => $item->textContent,
                    'href' => $item->getAttribute('href'),
                ));
            }
        }

        // 返回 JSON 格式的結果
        echo json_encode($api);
    } else {
        echo json_encode(array("error" => "URL not provided"));
    }
}
?>