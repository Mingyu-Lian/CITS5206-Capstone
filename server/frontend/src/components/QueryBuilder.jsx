// src/components/QueryBuilder.jsx
import { Button, Select, Input, DatePicker, Radio, Space, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

const OPERATORS = {
  text: ["Equal", "Contains", "Starts With"],
  select: ["Equal"],
  date: ["Equal", "Before", "After"],
};

const QueryRow = ({ index, condition, fields, onChange, onDelete }) => {
  const selectedField = fields.find((f) => f.key === condition.field);
  const operators = selectedField ? OPERATORS[selectedField.type] : [];

  return (
    <Space className="mb-2" wrap>
      <Select
        style={{ width: 160 }}
        value={condition.field}
        onChange={(val) => onChange(index, { ...condition, field: val, operator: "Equal", value: "" })}
      >
        {fields.map((field) => (
          <Option key={field.key} value={field.key}>{field.label}</Option>
        ))}
      </Select>

      <Select
        style={{ width: 140 }}
        value={condition.operator}
        onChange={(val) => onChange(index, { ...condition, operator: val })}
      >
        {operators.map((op) => (
          <Option key={op} value={op}>{op}</Option>
        ))}
      </Select>

      {selectedField?.type === "select" ? (
        <Select
          style={{ width: 160 }}
          value={condition.value}
          onChange={(val) => onChange(index, { ...condition, value: val })}
        >
          {selectedField.options.map((opt) => (
            <Option key={opt} value={opt}>{opt}</Option>
          ))}
        </Select>
      ) : selectedField?.type === "date" ? (
        <DatePicker
          style={{ width: 160 }}
          value={condition.value ? dayjs(condition.value) : null}
          onChange={(date) => onChange(index, { ...condition, value: date ? date.toISOString() : "" })}
        />
      ) : (
        <Input
          style={{ width: 160 }}
          value={condition.value}
          onChange={(e) => onChange(index, { ...condition, value: e.target.value })}
        />
      )}

      <Tooltip title="Remove">
        <Button icon={<DeleteOutlined />} onClick={() => onDelete(index)} danger />
      </Tooltip>
    </Space>
  );
};

const QueryBuilder = ({ fields, onApply, onClear  }) => {
  const [conditions, setConditions] = useState([]);
  const [logic, setLogic] = useState("AND");

  const handleChange = (index, updated) => {
    const newConditions = [...conditions];
    newConditions[index] = updated;
    setConditions(newConditions);
  };

  const handleAdd = () => {
    setConditions([...conditions, { field: fields[0].key, operator: "Equal", value: "" }]);
  };

  const handleDelete = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onApply({ logic, rules: conditions });
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <div className="mb-4 flex items-center justify-between">
        <Radio.Group value={logic} onChange={(e) => setLogic(e.target.value)}>
          <Radio.Button value="AND">AND</Radio.Button>
          <Radio.Button value="OR">OR</Radio.Button>
        </Radio.Group>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Condition
        </Button>
      </div>

      {conditions.map((condition, index) => (
        <QueryRow
          key={index}
          index={index}
          condition={condition}
          fields={fields}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClear}>Clear Filters</Button>
        <Button type="primary" onClick={handleApply} disabled={conditions.length === 0}>
            Apply Filters
            </Button>
        </div>

    </div>
  );
};

export default QueryBuilder;