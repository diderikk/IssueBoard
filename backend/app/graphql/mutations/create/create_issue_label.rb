module Mutations
	class Create::CreateIssueLabel < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "CreateIssueLabel"
		argument :attributes, Types::Input::IssueLabelInputType, required: true

		field :issue_label, Types::IssueLabelType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			issue_label = IssueLabel.new(name: attributes.name, color: attributes.color, issue_board_id: attributes.issue_board_id)

			last_issue_label_order = IssueBoard.includes(:issue_labels).find(attributes.issue_board_id).issue_labels[-1].order
			issue_label.order = last_issue_label_order+1;

			if issue_label.save!
				{
					issue_label: issue_label,
					errors: nil,
				}
			else
				{
					issue_label: nil,
					errors: issue_label.errors.full_messages,
				}
			end
		end

		private
		
		def authorized?(attributes:)
			issue_board_authorized?(attributes.issue_board_id, context);
		end
	end
end