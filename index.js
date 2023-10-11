import express from "express";
import { load } from "cheerio";
import axios from "axios";

const app = express();

app.get("/api/preview", async (req, res) => {
  try {
    const { url } = req.query;
    const { data } = await axios.get(url);
    const $ = load(data);

    const getMetaTag = (name) => {
      return (
        $(`meta[name=${name}]`).attr("content") ||
        $(`meta[propety="twitter${name}"]`).attr("content") ||
        $(`meta[property="og:${name}"]`).attr("content")
      );
    };

    /*Fetch values into an object */
    const preview = {
      url,
      title: $("title").first().text(),
      favicon:
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="alternate icon"]').attr("href"),
      description: getMetaTag("description"),
      image: getMetaTag("image"),
      author: getMetaTag("author"),
    };

    res.status(200).json(preview);
  } catch (error) {
    res
      .status(500)
      .json(
        "Something went wrong, please check your internet connection and also the url you provided"
      );
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});