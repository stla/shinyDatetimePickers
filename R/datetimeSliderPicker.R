#' Datetime picker with sliders
#' @description A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param value initial value, either a \code{POSIXct} object, or an object
#'   coercible to a \code{POSIXct} object;
#'   if \code{NULL}, it is set to the current time
#' @param second logical, whether to enable the second picker
#' @param save logical, whether to enable the 'save' button
#'
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#'
#' @export
#'
#' @return A \code{shiny.tag} object that can be included in a Shiny UI.
#'
#' @examples if(interactive()){
#' library(shinyDatetimePickers)
#' library(shiny)
#'
#' ui <- fluidPage(
#'   sidebarLayout(
#'     sidebarPanel(
#'       actionButton("setdt", label = as.character(Sys.time()),
#'                    class = "btn-info")
#'     ),
#'     mainPanel()
#'   )
#' )
#'
#' server <- function(input, output, session){
#'
#'   datetime <- reactiveVal(Sys.time())
#'
#'   observeEvent(input[["setdt"]], {
#'     showModal(modalDialog(
#'       datetimeSliderPickerInput("dtspicker", save = TRUE, value = datetime())
#'     ))
#'   })
#'
#'   observeEvent(input[["dtspicker_save"]], {
#'     datetime(input[["dtspicker"]])
#'     removeModal()
#'     updateActionButton(session, "setdt",
#'                        label = as.character(input[["dtspicker"]]))
#'   })
#'
#' }
#'
#' shinyApp(ui, server)
#' }
datetimeSliderPickerInput <- function(
  inputId, value = NULL,
  second = FALSE, save = FALSE)
{

  value <- if(is.null(value)) Sys.time() else as.POSIXct(value)

  reactR::createReactShinyInput(
    paste0(inputId, "-input"),
    "datetimeSliderPicker",
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
    datetime2list(value, second),
    list(shinyId = inputId, second = second, save = save),
    htmltools::tags$div
  )
}

#' @title Update a datetime slider picker widget
#' @description Change the value of a datetime slider picker input.
#' @param session the Shiny \code{session} object
#' @param inputId the id of the datetime slider picker widget to be updated
#' @param value new value for the datetime slider picker widget
#'
#' @return No returned value, this just updates the widget.
#' @export
updateDatetimeSliderPickerInput <- function(session, inputId, value) {
  session$sendCustomMessage(
    paste0("updateValue_", inputId),
    datetime2list(value, sec = TRUE)
  )
}
