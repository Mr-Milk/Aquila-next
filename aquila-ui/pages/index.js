import {Container, Grid} from "@mui/material";
import SectionIntro from "@/components/SectionIntro";
import StasCard from "@/components/InfoDisplay/StatsCard";
import {fetcher, getDbStatsURL} from "@/data/get";
import useSWR, {SWRConfig} from "swr";
import {IoStatsChart} from "react-icons/io5";
import {FaLungsVirus} from "react-icons/fa";
import {GiHeartOrgan} from "react-icons/gi";


const Home = ({fallback}) => {
    const {data, error} = useSWR(getDbStatsURL, fetcher);

    let dataCount, diseaseCount, tissueCount = [0, 0, 0];

    if (data != undefined) {
        dataCount = data.data_count;
        diseaseCount = data.disease_count;
        tissueCount = data.tissue_count;
    }

    return (
        <SWRConfig value={{fallback}}>
            <SectionIntro/>
            <Grid container flexDirection="row" alignItems="center" justifyContent="center" spacing={8}>
                <Grid item>
                    <StasCard title={"Total Data"} data={dataCount} iconcolor={"#f4a261"}>
                        <IoStatsChart/>
                    </StasCard>
                </Grid>
                <Grid item>
                    <StasCard title={"Total Disease"} data={diseaseCount} iconcolor={"#e76f51"}>
                        <FaLungsVirus/>
                    </StasCard>
                </Grid>
                <Grid item>
                    <StasCard title={"Total Tissue"} data={tissueCount} iconcolor={"#e9c46a"}>
                        <GiHeartOrgan/>
                    </StasCard>
                </Grid>
            </Grid>
            <Container maxWidth={"sm"}>

                <h1>Home</h1>
                <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium dolorem eveniet fugiat id nostrum, quae quam reiciendis repudiandae ullam! Debitis molestias officia totam. Dignissimos earum natus reiciendis reprehenderit soluta?</span><span>Distinctio laborum mollitia nihil praesentium voluptatibus! Accusantium atque dignissimos dolor dolorem enim ex ipsam natus, necessitatibus nisi omnis optio quam quasi quisquam repellendus, repudiandae saepe sapiente suscipit tempora unde voluptatum!</span><span>Accusantium aspernatur consequuntur cum, eligendi error ex illum ipsum labore, laborum necessitatibus nemo nesciunt nobis optio provident, qui quis sequi temporibus voluptas. Aut dolores esse est necessitatibus quam sapiente, vel!</span><span>Architecto blanditiis excepturi facere fugiat saepe voluptate? Accusamus adipisci aspernatur corporis cumque eum expedita facilis in iste iusto laboriosam maxime, mollitia nobis non possimus, quibusdam quidem sunt vel veniam voluptate.</span><span>Aspernatur, culpa, dolore ea eos error ex ipsam itaque labore laboriosam nulla numquam officia optio quis quos repudiandae, suscipit temporibus unde. Alias consectetur laudantium numquam, obcaecati optio rem soluta velit.</span><span>Aliquid assumenda at consectetur cupiditate doloribus ducimus eligendi eos facilis fugit, illum, inventore iste itaque magnam mollitia nostrum nulla officia perspiciatis, quia quidem quis repellendus saepe tempora tenetur totam voluptatum!</span><span>Aliquam dolores ex harum laudantium mollitia perspiciatis quam sint, unde. Debitis, ipsam, minima. Blanditiis eaque, harum, ipsam iste molestiae mollitia natus officia officiis, porro provident quae quam quas rerum sint.</span><span>Commodi distinctio eius exercitationem voluptatibus. At, aut cupiditate dolore ea eius esse et expedita hic laudantium natus nemo nobis perferendis quasi quod reiciendis, rem sed sint suscipit ullam voluptate? Ea.</span><span>Corporis culpa distinctio harum impedit laudantium nulla odit repellendus sint sunt ullam. Ad architecto beatae eaque eos non, voluptatum? Aliquid aut dolorem eveniet exercitationem, fugiat in iure pariatur quidem voluptas!</span><span>Assumenda consectetur eos fugiat, inventore maiores minus nesciunt qui quia quisquam ratione reiciendis tempore, ullam vitae? Alias deserunt dignissimos eum ipsa labore magni maiores, minima neque nisi nulla, quidem quis!</span><span>Adipisci blanditiis commodi consectetur corporis cumque delectus dicta doloremque eum, expedita facilis fugiat hic illo, minima molestiae neque nihil obcaecati quam quidem, quisquam rem ullam velit voluptas voluptatum. Quos, veniam?</span><span>Beatae eius eos et eum sapiente. Ab amet at consequuntur cumque cupiditate deserunt doloribus dolorum et ipsum iure magnam maiores neque nobis, odio odit quae quaerat quas rem reprehenderit voluptatibus.</span><span>Accusamus assumenda autem blanditiis consectetur deserunt eligendi et iure nisi odit officia, quis quod quos similique temporibus ut veritatis vitae. Aliquam amet aperiam, eligendi minus molestiae necessitatibus perferendis quam reprehenderit?</span><span>Commodi cumque cupiditate distinctio dolorem, ea facere hic id iste molestiae necessitatibus nisi officia praesentium provident, quae quia rem reprehenderit tempora ut vel voluptates! Eius ipsa labore quia sunt unde?</span><span>Aliquid architecto cum cumque, doloribus eaque impedit non officiis, pariatur perspiciatis quae quasi repellat tempore totam! Aliquid cumque deserunt doloribus eveniet fugiat impedit inventore, laudantium neque, quas quasi quidem sint!</span>
                </p>
            </Container>
        </SWRConfig>

    )
}

export async function getStaticProps() {
    const data = await fetcher(getDbStatsURL);

    return {
        props: {
            fallback: {
                getRequestURL: data
            }
        }
    }
}

export default Home;