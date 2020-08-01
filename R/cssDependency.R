cssDependency <- htmltools::htmlDependency(
  name = "datetimePicker-css",
  version = "1.0.0",
  src = "www/shinyDatetimePickers/datetimePicker/css",
  package = "shinyDatetimePickers",
  stylesheet = c(
    paste0(
      "datetime-slider-picker/",
      c("Calendar.css", "TimePicker.css", "Picker.css")
    ),
    paste0(
      "datetime-picker/",
      c("Calendar.css", "Clock.css", "DateTimePicker.css")
    ),
    paste0(
      "datetime-mui-picker/",
      c("FrontUI.css")
    )
  )
)
