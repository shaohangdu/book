<?php

// 引入 IconvService 類
require_once 'IconvService.php';  // 根據實際路徑調整

set_time_limit(0);
header("Content-Type:text/html;charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 假設 $request->url 是您要抓取的 URL，可以用 GET 請求傳遞
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['url'])) {
        $next = "";

        $content_url = $data['url'];
        $content_html = file_get_contents("compress.zlib://" . $content_url);
        $content_str = iconv("gb2312", "utf-8//IGNORE", $content_html);

        $content_dom = new DOMDocument;
        @$content_dom->loadHTML($content_html);
        $title = $content_dom->getElementsByTagName("title")[0]->textContent;

        preg_match_all('/(?<=&nbsp;&nbsp;&nbsp;&nbsp;)(.*)(?=<br)/', $content_str, $matches);
        preg_match_all('/(?<=var next_page = ")(.*)(?=";)/', $content_str, $next);
        preg_match_all('/(?<=var preview_page = ")(.*)(?=";)/', $content_str, $preview);
        $api = array(
            'title' => $title,
            "str" => IconvService::zh_auto(implode("<br/>", $matches[1])),
            'next' => implode(",", $next[1]),
            'preview' => implode(",", $preview[1]),
        );

        // 返回 JSON 格式的結果
        echo json_encode($api);
    } else {
        echo json_encode(array("error" => "URL not provided"));
    }
}
?>