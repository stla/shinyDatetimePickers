#' Datetime picker
#'
#' A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param value initial value of the datetime picker; if \code{NULL}, the
#'   initial value is set to the system time
#' @param second logical, whether to enable the second picker
#' @param save logical, whether to enable the 'save' button
#'
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#'
#' @export
datetimeSliderPickerInput <- function(
  inputId, value = NULL,
  second = FALSE, save = FALSE)
{

  if(is.null(value)) {
    value <- Sys.time()
  }

  reactR::createReactShinyInput(
    paste0(inputId, "-input"),
    "datetimeSliderPicker",
    list(
      htmltools::htmlDependency(
        name = "datetimePicker-input",
        version = "1.0.0",
        src = "www/shinyDatetimePickers/datetimePicker",
        package = "shinyDatetimePickers",
        script = "datetimePicker.js"
      ),
      cssDependency
    ),
    datetime2list(value, second),
    list(shinyId = inputId, second = second, save = save),
    htmltools::tags$div
  )
}

# #' <Add Title>
# #'
# #' <Add Description>
# #'
# #' @export
# updateDatetimePickerInput <- function(session, inputId, value, configuration = NULL) {
#   message <- list(value = value)
#   if (!is.null(configuration)) message$configuration <- configuration
#   session$sendInputMessage(inputId, message);
# }
