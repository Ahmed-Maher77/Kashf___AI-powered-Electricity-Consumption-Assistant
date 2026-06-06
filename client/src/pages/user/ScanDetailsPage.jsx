import { useParams } from "react-router-dom";
import PagePlaceholder from "../../components/PagePlaceholder/PagePlaceholder";

const ScanDetailsPage = () => {
    const { id } = useParams();

    return <PagePlaceholder pageKey="scanDetails" route={`/history/${id}`} />;
};

export default ScanDetailsPage;
