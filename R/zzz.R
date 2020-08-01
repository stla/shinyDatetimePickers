#' @importFrom shiny registerInputHandler
#' @import lubridate
#' @noRd
.onLoad <- function(...){

  shiny::registerInputHandler("shinyDatetimePickers.date", function(data, ...) {
    dt <- Sys.time()
    day(dt) <- data[["date"]][["date"]]
    month(dt) <- data[["date"]][["month"]]
    year(dt) <- data[["date"]][["year"]]
    hour(dt) <- data[["time"]][["hour"]]
    minute(dt) <- data[["time"]][["minute"]]
    second(dt) <-
      ifelse(is.null(data[["time"]][["second"]]), 0, data[["time"]][["second"]])
    dt
  }, force = TRUE)

}
