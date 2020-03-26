import { Accessor } from 'gqless';
export declare const wrapMutableObject: <T extends object>(obj: T) => T;
export declare const notifyMutation: (accessor: Accessor<import("gqless").Selection<import("gqless").DataTrait>, Accessor<import("gqless").Selection<import("gqless").DataTrait>, any>>) => void;
