#' <Add Title>
#'
#' <Add Description>
#'
#' @importFrom shiny restoreInput
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#'
#' @export
datetimeMaterialPickerInput <- function(inputId, value = NULL, style = NULL) {
  if(is.null(value)) value <- Sys.time()
  reactR::createReactShinyInput(
    inputId,
    "datetimeMaterialPicker",
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
    NULL,
    list(
      shinyId = inputId,
      value = datetime2list(value, sec = TRUE)
    ),
    container = function(...) htmltools::tags$div(..., style = style)
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
