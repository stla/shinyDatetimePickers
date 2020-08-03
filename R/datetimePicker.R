#' Datetime picker
#' @description A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param value initial value, either a \code{POSIXct} object, or an object
#'   coercible to a \code{POSIXct} object;
#'   if \code{NULL}, it is set to the current time
#' @param style inline CSS for the container
#'
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#' @export
#'
#' @examples if(interactive()){
#'
#' library(shinyDatetimePickers)
#' library(shiny)
#'
#' ui <- fluidPage(
#'   br(),
#'   sidebarLayout(
#'     sidebarPanel(
#'       tags$fieldset(
#'         tags$legend("Click to change time"),
#'         datetimePickerInput(
#'           "dtpicker",
#'           style =
#'             "font-family: Montserrat, 'Segoe UI', Tahoma, sans-serif;"
#'         )
#'       )
#'     ),
#'     mainPanel(
#'       verbatimTextOutput("dtpicker")
#'     )
#'   )
#' )
#'
#' server <- function(input, output){
#'   output[["dtpicker"]] <- renderPrint({
#'     input[["dtpicker"]]
#'   })
#' }
#'
#' shinyApp(ui, server)
#'
#' }
datetimePickerInput <- function(inputId, value = NULL, style = NULL) {
  value <- if(is.null(value)) Sys.time() else as.POSIXct(value)
  reactR::createReactShinyInput(
    inputId,
    "datetimePicker",
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

#' <Add Title>
#'
#' <Add Description>
#'
#' @export
updateDatetimePickerInput <- function(session, inputId, value, configuration = NULL) {
  message <- list(value = value)
  if (!is.null(configuration)) message$configuration <- configuration
  session$sendInputMessage(inputId, message);
}
