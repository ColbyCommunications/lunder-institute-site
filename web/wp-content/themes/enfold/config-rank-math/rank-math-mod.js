(function ($)
{
    var aviaBuilder = $('#avia_builder');

    if (aviaBuilder.is('.avia-hidden'))
    {
        return;
    }

    var aviaParsedContent = "";
    var aviaRankMathAttachmentsIDs = [];
    var aviaRankMathAttachmentsData = [];
    var aviaRankMathAllowedShortcodes = ["av_heading", "av_icon_box", "av_image", "av_image_hotspot", "av_slideshow", "av_fullscreen", "av_slideshow_full", "av_slideshow_accordion", "av_gallery", "av_horizontal_gallery", "av_masonry_gallery"];

    var aviaRankMath = window.rankMath;
    var aviaWordPress = window.wp;

    var aviaBuilderShortcodeField = aviaBuilder.find('#_aviaLayoutBuilderCleanData');

    if (aviaRankMath.currentEditor == 'classic' || aviaRankMath.currentEditor == 'gutenberg')
    {
        setTimeout(function ()
        {
            avia_tranform_builder_content();
        }, 100);

        $('body').on('avia_rank_math_content_parsed', function ()
        {
            aviaWordPress.hooks.addFilter('rank_math_content', 'rank-math', avia_rank_math_content, 11);
        });

        $('#aviaLayoutBuilder').on('avia-storage-update avia-history-update', function ()
        {
            avia_tranform_builder_content();

            setTimeout(function ()
            {
                window.rankMathEditor.refresh('content');
            }, 100);
        });
    }

    function avia_rank_math_content()
    {
        return aviaParsedContent;
    }


    function avia_get_builder_content()
    {
        var builderData = aviaBuilderShortcodeField.val();

        return builderData;
    }


    function avia_get_builder_shortcodes()
    {
        var builderContent = avia_get_builder_content();
        var builderShortcodes = builderContent.split('\n\n').slice(0, -1);

        return builderShortcodes;
    }


    function avia_tranform_builder_content()
    {
        aviaParsedContent = "";

        var builderShortcodes = avia_get_builder_shortcodes();

        builderShortcodes.map(function (shortcode, i)
        {
            aviaParsedContent += avia_transform_shortcode(shortcode);
        });

        if (aviaRankMathAttachmentsIDs.length === 0)
        {
            $('body').trigger('avia_rank_math_content_parsed');
        } else
        {
            return avia_fetch_attachments(aviaRankMathAttachmentsIDs).then(function (attachments)
            {
                aviaParsedContent = avia_replace_attachments(attachments, aviaParsedContent);

                $('body').trigger('avia_rank_math_content_parsed');
            });
        }
    }


    function avia_transform_shortcode(shortcode)
    {
        if (aviaWordPress.shortcode == undefined)
        {
            return "";
        }

        var element = aviaWordPress.shortcode.attrs(shortcode);
        var shortcodeTag = avia_clean_shortcode_name(element.numeric[0]);
        var shortcodeContent = "";

        if (aviaRankMathAllowedShortcodes.includes(shortcodeTag))
        {
            var context = element;

            switch (shortcodeTag)
            {
                case "av_horizontal_gallery":
                case "av_masonry_gallery":
                    shortcodeTag = "gallery";
                    break;
                case "av_image_hotspot":
                    shortcodeTag = "image";
                    break;
                case "av_slideshow":
                case "av_slideshow_full":
                case "av_fullscreen":
                case "av_slideshow_accordion":
                    shortcodeTag = "slideshow";
                    context = shortcode;
                    break;
                default:
                    break;
            }

            var transform = eval("avia_transform_" + shortcodeTag.replace("av_", ""));

            shortcodeContent = transform(context);
        } else
        {
            shortcodeContent = shortcode + "\n\n";
        }

        return shortcodeContent;
    }


    function avia_transform_image(element)
    {
        var imageAtts = element.named;
        var imageTag = avia_clean_shortcode_name(element.numeric[0]);

        avia_push_attachment_ids(aviaRankMathAttachmentsIDs, imageAtts.attachment);

        return "<img class='" + imageTag + "' src='" + imageAtts.src + "' alt='IMAGE_ALT_PLACEHOLDER_" + imageAtts.attachment + "' />\n\n";
    }


    function avia_transform_heading(element)
    {
        return "<" + element.named.tag + ">" + element.named.heading + "</" + element.named.tag + ">\n\n";
    }


    function avia_transform_icon_box(element)
    {
        var iconBoxAtts = element.named;
        var iconBoxTag = avia_clean_shortcode_name(element.numeric[0]);
        var iconBoxheadingTag = iconBoxAtts.heading_tag ? iconBoxAtts.heading_tag : "h3";
        var iconBoxTitle = iconBoxAtts.title ? iconBoxAtts.title : "";
        var iconBoxHeading = "\t<" + iconBoxheadingTag + ">" + iconBoxTitle + "</" + iconBoxheadingTag + ">\n";
        var iconBoxContent = "\t<p>" + avia_extract_shortcode_content(element.numeric) + "<p>\n";

        return "<div class='" + iconBoxTag + "'>\n" + iconBoxHeading + iconBoxContent + "</div>\n\n";
    }


    function avia_transform_gallery(element)
    {
        var galleryTag = avia_clean_shortcode_name(element.numeric[0]);
        var galleryAtts = element.named;
        var galleryItems = galleryAtts.ids.split(',');
        var galleryContent = "";

        if (galleryTag == "av_masonry_gallery")
        {
            if (galleryAtts.size !== "flex")
            {
                return "<div class='" + galleryTag + "'></div>\n\n";
            }
        }

        for (let i = 0; i < galleryItems.length; i++)
        {
            var galleryItemID = galleryItems[i];

            avia_push_attachment_ids(aviaRankMathAttachmentsIDs, galleryItemID);

            galleryContent += "\t<img src='IMAGE_URL_PLACEHOLDER_" + galleryItemID + "' alt='IMAGE_ALT_PLACEHOLDER_" + galleryItemID + "' />\n";
        }

        return "<div class='" + galleryTag + "'>\n" + galleryContent + "</div>\n\n";
    }


    function avia_transform_slideshow(shortcode)
    {
        var slider = aviaWordPress.shortcode.attrs(shortcode);
        var sliderTag = avia_clean_shortcode_name(slider.numeric[0]);
        var slideElTag = avia_get_slideshow_item_tag(sliderTag);
        var slideRegExp = aviaWordPress.shortcode.regexp(slideElTag);
        var sliderItems = shortcode.match(slideRegExp);
        var sliderContent = "";

        if (sliderItems == null)
        {
            return "<div class='" + sliderTag + "'>\n</div>\n\n";;
        }

        for (let i = 0; i < sliderItems.length; i++)
        {
            var slideEl = aviaWordPress.shortcode.attrs(sliderItems[i]);
            var slideAtts = slideEl.named;
            var slideID = slideAtts.id ? slideAtts.id : slideEl.numeric[1].match(/([^id='(\D)'$])\w+/g)[0];
            var slideHeadingTag = slideAtts.heading_tag == "" ? "h2" : slideAtts.heading_tag;
            var slideHeading = slideAtts.title == "" || slideAtts.title == undefined ? "" : "\t<" + slideHeadingTag + ">" + slideAtts.title + "</" + slideHeadingTag + ">\n";

            avia_push_attachment_ids(aviaRankMathAttachmentsIDs, slideID);

            sliderContent += "\t<div class='" + slideElTag + "'>\n\t" + slideHeading + "\t\t<img src='IMAGE_URL_PLACEHOLDER_" + slideID + "' alt='IMAGE_ALT_PLACEHOLDER_" + slideID + "' />\n\t</div>\n";
        }

        return "<div class='" + sliderTag + "'>\n" + sliderContent + "</div>\n\n";
    }

    function avia_get_slideshow_item_tag(slideshow)
    {
        var slideTag = "av_slide";

        switch (slideshow)
        {
            case "av_slideshow_full":
                slideTag = "av_slide_full"
                break;
            case "av_fullscreen":
                slideTag = "av_fullscreen_slide";
                break;
            case "av_slideshow_accordion":
                slideTag = "av_slide_accordion";
                break;
            default:
                break;
        }

        return slideTag;
    }


    function avia_push_attachment_ids(attachments, attachment_id)
    {
        // prevents attachment duplicates
        if (!attachments.includes(attachment_id))
        {
            attachments.push(attachment_id);
        }
    }


    function avia_replace_attachments(attachments)
    {
        attachments.map(function (attachment, i)
        {
            aviaParsedContent = aviaParsedContent.replaceAll("IMAGE_URL_PLACEHOLDER_" + attachment.id, attachment.url);
            aviaParsedContent = aviaParsedContent.replaceAll("IMAGE_ALT_PLACEHOLDER_" + attachment.id, attachment.alt);
        });

        return aviaParsedContent;
    }


    function avia_fetch_attachments(attachmentIDs)
    {
        aviaRankMathAttachmentsIDs = [];

        return new Promise((resolve, reject) =>
        {
            if (wp.media)
            {
                wp.media.query({ post__in: attachmentIDs })
                    .more()
                    .then(function ()
                    {
                        aviaRankMathAttachmentsData = [];

                        for (let i = 0; i < attachmentIDs.length; i++)
                        {
                            aviaRankMathAttachmentsData.push(
                                avia_get_attachment(wp.media.attachment(attachmentIDs[i]))
                            );
                        }

                        resolve(aviaRankMathAttachmentsData);
                    });

            } else
            {
                resolve(aviaRankMathAttachmentsData);
            }
        });
    }


    function avia_get_attachment(attachment)
    {
        return {
            id:  attachment.get("id"),
            url: attachment.get("url"),
            alt: attachment.get("alt")
        }
    }


    function avia_create_dummy_alt_text(element)
    {
        var altText = "";
        var focusKeywords = aviaRankMath.variables.keywords.example.split(',');

        focusKeywords.map(function (keyWord, i)
        {
            var separator = i + 1 === focusKeywords.length ? "" : " ";

            if (element.numeric.includes(keyWord))
            {
                altText += keyWord + separator;
            }
        });

        return altText;
    }


    function avia_clean_shortcode_name(element_name)
    {
        return element_name.replace("[", "");
    }


    function avia_extract_shortcode_content(element_content)
    {
        var filtered_content = element_content.filter(function (value, index, arr)
        {
            return [0, 1, element_content.length - 1].includes(index) == false;
        });

        return filtered_content.join(" ");
    }
})(jQuery);
