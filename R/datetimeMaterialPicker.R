#' Material design datetime picker
#' @description A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param label a label, a character string (HTML is not allowed), or
#'   \code{NULL} for no label
#' @param value initial value, either a \code{POSIXct} object, or an object
#'   coercible to a \code{POSIXct} object;
#'   if \code{NULL}, it is set to the current time
#' @param disablePast logical, whether to disable past dates
#' @param disableFuture logical, whether to disable future dates
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
#'       datetimeMaterialPickerInput(
#'         "dtmpicker",
#'         label = "Appointment",
#'         disablePast = TRUE
#'       )
#'     ),
#'     mainPanel(
#'       verbatimTextOutput("dtmpicker")
#'     )
#'   )
#' )
#'
#' server <- function(input, output){
#'   output[["dtmpicker"]] <- renderPrint({
#'     input[["dtmpicker"]]
#'   })
#' }
#'
#' shinyApp(ui, server)
#'
#' }
datetimeMaterialPickerInput <- function(
  inputId, label = NULL, value = NULL,
  disablePast = FALSE, disableFuture = FALSE,
  style = NULL
) {
  label <- if(!is.null(label)) as.character(label)
  value <- if(is.null(value)) Sys.time() else as.POSIXct(value)
  reactR::createReactShinyInput(
    inputId,
    "datetimeMaterialPicker",
    list(
      htmltools::htmlDependency(
        name = "datetimePicker-input",
        version = "1.0.0",
        src = "www/datetimePicker",
        package = "shinyDatetimePickers",
        script = "datetimePicker.js"
      ),
      cssDependency
    ),
    NULL,
    list(
      shinyId = inputId,
      value = datetime2list(value, sec = TRUE),
      label = label,
      disableFuture = disableFuture,
      disablePast = disablePast
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
