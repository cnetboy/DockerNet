import ForceGraph2D from 'react-force-graph-2d';

interface IProps {
  containers: {
    id: string;
    name: string;
    ipAddress: string;
  }[];
  network?: {
    driver: string;
    name: string;
  };
}

export const GraphDisplay: React.FC<IProps> = ({ containers, network }) => {
  const createGraphData = (
    containers: { id: string; name: string; ipAddress: string }[],
    networkName: string
  ) => {
    // Format nodes according react-force-graph API
    const containerNodes = containers.map((container) => {
      return {
        id: container.name,
        type: 'container',
      };
    });

    const nodes = [{ id: networkName, type: 'network' }, ...containerNodes];
    // Format link objects for limited mesh: each container connects to the next 4 containers in a circular manner
    const links = [];
    for (let i = 0; i < containers.length; i++) {
      for (let j = 1; j <= 4; j++) {
        const targetIndex = (i + j) % containers.length;
        if (targetIndex !== i) { // avoid self
          links.push({
            source: containers[i].name,
            target: containers[targetIndex].name,
          });
        }
      }
    }

    return {
      nodes: nodes,
      links: links,
    };
  };

  const graphData = createGraphData(containers, network.name);

  return (
    <div>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={'id'}
        width={500}
        height={500}
        // nodes colored by container or network
        nodeAutoColorBy={'type'}
      />
    </div>
  );
};
