import { Helmet } from "react-helmet-async";
import PagePlaceholder from "../../components/PagePlaceholder/PagePlaceholder";

const AiLogsPage = () => (
    <>
        <Helmet>
            <title>سجلات الذكاء الاصطناعي — كشف</title>
            <meta name="description" content="سجلات استعلامات الذكاء الاصطناعي في كشف — تتبع وتحليل تفاعلات المساعد الذكي." />
        </Helmet>
        <PagePlaceholder pageKey="aiLogs" route="/admin/ai-logs" />
    </>
);

export default AiLogsPage;
