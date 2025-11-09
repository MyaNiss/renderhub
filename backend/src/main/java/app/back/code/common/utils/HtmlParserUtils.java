package app.back.code.common.utils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HtmlParserUtils {

    private static final String UPLOADS_URL_PREFIX = "/uploads/";

    public static List<String> extractImagePathsFromHtml(String htmlContent) {
        if(htmlContent==null || htmlContent.isEmpty()){
            return List.of();
        }

        Document doc = Jsoup.parse(htmlContent);
        Elements images = doc.select("img");

        return images.stream()
                .map(img -> img.attr("src"))
                .filter(src -> src.startsWith(UPLOADS_URL_PREFIX))
                .map(src -> src.substring(UPLOADS_URL_PREFIX.length()))
                .collect(Collectors.toList());
    }
}
