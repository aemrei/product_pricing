import { Item } from "semantic-ui-react";
import QuotationItem from "./QuotationItem";

const QuotationList = ({ quotations }) => {
  return (
    <Item.Group divided>
      {quotations.map((q) => (
        <QuotationItem key={q._id} quotation={q}/>
      ))}
    </Item.Group>
  );
};

export default QuotationList;
