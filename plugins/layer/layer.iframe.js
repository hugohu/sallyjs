jQuery(function() {
    $.layer("iframe", {
        "open": function() {
            var href = this.$this.attr("href");
            var loading = $("#loading");
            var iframe = this.showbox.find("iframe");
            loading.addClass("active");
            clearTimeout(this.outime);
            this.outime = setTimeout(function() {
                iframe.attr("src", href)
                iframe.load(function() {
                    loading.removeClass("active");
                })
            }, 360)
        },
        "closed": function() {
            var iframe = this.showbox.find("iframe");
            iframe.attr("src", "");
        }
    })
})