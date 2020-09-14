type CellValueProperties = {
    model:          { value: number, isValid: boolean };
    onpointerdown:  (event: PointerEvent) => any;
}

export const CellValue = (props: CellValueProperties) => (
    <div className={ props.model.isValid ? "value" : "invalid value" } onpointerdown={ props.onpointerdown }>
        { props.model.value > 0 ? props.model.value : "" }
    </div>
);