#' @import lubridate
#' @noRd
datetime2list <- function(dt, sec){
  list(
    date = list(
      year = year(dt),
      month = month(dt),
      date = day(dt)
    ),
    time = if(sec) list(
      hour = hour(dt),
      minute = minute(dt),
      second = floor(second(dt))
    ) else list(
      hour = hour(dt),
      minute = minute(dt)
    )
  )
}

