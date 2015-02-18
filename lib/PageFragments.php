<?php

/**
 * Created by PhpStorm.
 * User: msyk
 * Date: 14/12/29
 * Time: 12:27
 */
class PageFragments extends DB_UseSharedObjects
    implements Extending_Interface_AfterGet, Extending_Interface_AfterGet_WithNavigation
{
    function doBeforeGetFromDB($dataSourceName)
    {

    }

    private $resultCount;

    function doAfterGetFromDB($dataSourceName, $result)
    {
        $lang = $this->dbSettings->getCriteriaValue("language");
        if ($lang !== 'ja') {
            $lang = 'en';
        }
        if ($dataSourceName == "pagebuilder") {
            return array(
                array(
                    "pagenavigation" => $this->fileContents("{$lang}/pagenavigation.html"),
                    "pageheader" => $this->fileContents("{$lang}/pageheader.html"),
                    "pagefooter" => $this->fileContents("{$lang}/pagefooter.html")
                )
            );
        } else if ($dataSourceName == "newslist") {
            $this->resultCount = 0;
            $newsList = array();
            $dom = new DOMDocument;
            $dom->recover = true;
            $dom->strictErrorChecking = false;
            libxml_use_internal_errors(true);
            $handle = curl_init();
            curl_setopt($handle, CURLOPT_HEADER, 0);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, 1);
            if ($lang === 'en') {
                curl_setopt($handle, CURLOPT_URL, 'http://inter-mediator.com/en/news.html');
            } else {
                curl_setopt($handle, CURLOPT_URL, 'http://inter-mediator.com/ja/news.html');
            }
            $response = curl_exec($handle);
            $response = str_replace('<!DOCTYPE html>', '', $response);
            curl_close($handle);
            $dom->loadHTML($response);
            libxml_clear_errors();
            $result = $dom->getElementsByTagName('li');
            for ($i = 0; $i < $result->length; $i++) {
                $node = $result->item($i);
                $newDom = new DOMDocument;
                if ($node->textContent != "\n" && strpos($node->getAttribute('class'), 'top3') !== false) {
                    $newDom->appendChild($newDom->importNode($node, true));
                    $newsList[] = array('newsitem' => $newDom->saveHTML());
                    $this->resultCount++;
                }
            }
            return $newsList;
        }
        return array(array());
    }

    function countQueryResult($dataSourceName)
    {
        if ($dataSourceName == "pagebuilder") {
            return 1;
        } else if ($dataSourceName == "newslist") {
            return $this->resultCount;
        }
        return 0;
    }

    function fileContents($filename)
    {
        $dom = new DOMDocument;
        $dom->recover = true;
        $dom->strictErrorChecking = false;
        libxml_use_internal_errors(true);
        $dom->loadHTML(mb_convert_encoding(file_get_contents($filename), 'HTML-ENTITIES', 'UTF-8'));
        $result = $dom->getElementsByTagName("body");
        $nodeList = $result->item(0)->childNodes;
        $newDom = new DOMDocument;
        for ($i = 0; $i < $nodeList->length; $i++) {
            $node = $nodeList->item($i);
            if ($node->textContent != "\n") {
                $newDom->appendChild($newDom->importNode($node, true));
            }
        }
        return $newDom->saveHTML();
    }
}

